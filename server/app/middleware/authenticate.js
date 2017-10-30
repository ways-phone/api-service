import jwt from 'jsonwebtoken';
import User from '../models/user';
import Constants from '../config/constants';

const { sessionSecret } = Constants.security;

export default function authenticate(req, res, next) {
  const { authorization } = req.headers;

  jwt.verify(authorization, sessionSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).json(err);
    }

    try {
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(401).json({ message: 'User not found.' });
      }

      req.currentUser = user;
      next();
    } catch (err) {
      next(err);
    }
  });
}
