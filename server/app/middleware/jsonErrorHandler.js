export default function(logger) {
  return function(error, req, res, next) {
    if (error) {
      if (error instanceof SyntaxError) {
        res.status(400).json({
          message: 'Invalid JSON',
          details: error.message,
        });
        return;
      } else {
        if (logger) {
          logger.error(error);
        }

        res.status(500).json({
          message: 'Server Error',
          details: error.message,
        });

        return;
      }
    }

    next();
  };
}
