const StatusCodes = require('../utils/statusCodes');

module.exports = (err, req, res, next) => {
  if (err.code === 11000) {
    res.status(StatusCodes.CONFLICT)
      .send({ message: 'Attempt to create duplicate entry' });
    return;
  }
  const statusCode = err.statusCode || StatusCodes.SERVER_ERROR;
  res.status(statusCode)
    .send({ message: err.message });
  next();
};
