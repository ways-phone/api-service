import authenticate from './authenticate';
import Constants from '../config/constants';

export default function accessControl(role) {
  if (!role) {
    throw new Error('Provide a role.');
  }

  const requiredRoleIndex = Constants.userRoles.indexOf(role);

  if (requiredRoleIndex < 0) {
    throw new Error('Not a valid role.');
  }

  return (req, res, next) =>
    authenticate(req, res, err => {
      const currentRoleindex = Constants.userRoles.indexOf(
        req.currentUser.role
      );

      if (err || !req.currentUser || currentRoleindex < requiredRoleIndex) {
        res.status(403).json({
          message:
            'You do not have the correct permissions to access this page.',
        });
        return;
      }

      next();
    });
}
