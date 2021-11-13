const User = require('../models/user');
const StatusCodes = require('../utils/statusCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(StatusCodes.SERVER_ERROR)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      const error = new Error('Can not find user with required id');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(StatusCodes.INVALID_DATA)
          .send({ message: 'invalid data' });
      }
      if (err.statusCode === 404) {
        res.status(404)
          .send({ message: err.message });
      }
      res.status(StatusCodes.SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar
  } = req.body;
  User.create({
    name,
    about,
    avatar
  })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.INVALID_DATA)
          .send({ message: 'invalid data' });
      }
      res.status(StatusCodes.SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.updateUserProfile = (req, res) => {
  const {
    name,
    about
  } = req.body;
  if (!name || !about) {
    res.status(StatusCodes.INVALID_DATA)
      .send({ message: 'invalid data' });
    return;
  }
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
        res.status(StatusCodes.INVALID_DATA)
          .send({ message: 'invalid data' });
      }
      res.status(StatusCodes.SERVER_ERROR)
        .send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(StatusCodes.INVALID_DATA)
      .send({ message: 'invalid data' });
    return;
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .orFail(() => {
      const error = new Error('Can not find user with required id');
      error.statusCode = 404;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(StatusCodes.INVALID_DATA)
          .send({ message: 'invalid data' });
      }
      if (err.statusCode === 404) {
        res.status(404)
          .send({ message: err.message });
      }
      res.status(StatusCodes.SERVER_ERROR)
        .send({ message: err.message });
    });
};
