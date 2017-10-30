import jwt from 'jsonwebtoken';
import User from '../models/user';
import Constants from '../config/constants';

const { sessionSecret } = Constants.security;

export default function getUser(req, res, next) {
  const { authorization } = req.headers;

  jwt.verify(authorization, sessionSecret, async (err, decoded) => {
    if (err) {
      return next();
    }

    try {
      const user = await User.findById(decoded._id);
      if (!user) return;

      req.currentUser = user;
      next();
    } catch (err) {
      next(err);
    }
  });
}
