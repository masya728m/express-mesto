const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const InvalidDataError = require('../errors/invalidDataError');
const NotFoundError = require('../errors/notFoundError');
const ConflictError = require('../errors/conflictError');

const {
  JWT_SECRET = 'dev-secret-key'
} = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const id = req.params.id || req.user._id;
  User.findById(id)
    .orFail(() => {
      throw NotFoundError('Can not find user with required id');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash
    })
      .then(() => res.send({
        data: {
          name,
          about,
          avatar,
          email
        }
      })))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('Invalid data'));
      }
      if (err.code === 11000) {
        return next(new ConflictError(`email ${email} already exists!`));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200)
        .send({ token });
    })
    .catch(next);
};

module.exports.updateUserProfile = (req, res, next) => {
  const {
    name,
    about
  } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
    about
  }, {
    new: true,
    runValidators: true
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('Invalid Data'));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new InvalidDataError('invalid data');
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true
  })
    .orFail(() => {
      throw new NotFoundError('Can not find user with required id');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('Invalid Data'));
      }
      return next(err);
    });
};
