const StatusCodes = require('../utils/statusCodes');

class InvalidDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.INVALID_DATA;
  }
}

module.exports = InvalidDataError;
