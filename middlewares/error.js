const StatusCodes = require('../utils/statusCodes');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const reservedErrorNames = [
    'ValidationError',
    'CastError'
  ];
  if (err.statusCode) {
    return res.status(err.statusCode)
      .send({ message: err.message });
  }
  if (reservedErrorNames.some((error) => error === err.name)) {
    return res.status(StatusCodes.INVALID_DATA)
      .send({ message: 'invalid data' });
  }
  if (err.code === 11000) {
    return res.status(StatusCodes.FORBIDDEN)
      .send({ message: 'Attempt to create duplicate entry' });
  }
  return res.status(StatusCodes.SERVER_ERROR)
    .send(err.message);
};
