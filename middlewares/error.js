const StatusCodes = require('../utils/statusCodes');

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.SERVER_ERROR;
  res.status(statusCode)
    .send({ message: err.message });
  next();
};
