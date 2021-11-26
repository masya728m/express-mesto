const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');

const {
  JWT_SECRET = 'dev-secret-key'
} = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError('Authorization required'));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
    return;
  }

  req.user = payload;

  next();
};
