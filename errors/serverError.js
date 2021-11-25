const StatusCodes = require('../utils/statusCodes');

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.SERVER_ERROR;
  }
}

module.exports = ServerError;
