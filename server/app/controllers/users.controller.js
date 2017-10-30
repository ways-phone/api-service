import BaseController from './base.controller';
import User from '../models/user';

class UsersController extends BaseController {
  whitelist = ['firstname', 'lastname', 'email', 'username', 'password', 'role'];

  _populate = async (req, res, next) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ username });

      if (!user) {
        const err = new Error('User not found.');
        err.status = 404;
        return next(err);
      }

      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };

  search = async (req, res, next) => {
    try {
      res.json(await User.find());
    } catch (err) {
      next(err);
    }
  };

  fetch = (req, res) => {
    const user = req.user || req.currentUser;

    if (!user) {
      return res.sendStatus(404);
    }

    res.json(user);
  };

  changePassword = async (req, res, next) => {
    const { oldpassword, newpassword } = this.filterParams(req.body, ['oldpassword', 'newpassword']);

    const user = req.user || req.currentUser;
    if (!user) {
      return res.sendStatus(404);
    }

    res.status(202).json(await user.updatePassword(oldpassword, newpassword));
  };

  create = async (req, res, next) => {
    const params = this.filterParams(req.body, this.whitelist);

    const user = req.user || req.currentUser;

    const hasRole = !!params.role;
    const isAdmin = user && user.role === 'admin';

    if (hasRole && !isAdmin) delete params.role;

    let newUser = new User({
      ...params,
    });

    try {
      const savedUser = await newUser.save();
      const token = savedUser.generateToken();
      res.status(201).json({ token });
    } catch (err) {
      err.status = 400;
      next(err);
    }
  };
}

export default new UsersController();
