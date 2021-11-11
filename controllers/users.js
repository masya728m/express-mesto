const User = require('../models/user');
const StatusCodes = require('../utils/statusCodes');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(StatusCodes.INVALID_DATA)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => res.send(user))
    .catch((err) => res.status(err.name === 'CastError' ? StatusCodes.NOT_FOUND : StatusCodes.SERVER_ERROR)
      .send({ message: err.message }));
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
    .catch((err) => res.status(StatusCodes.INVALID_DATA)
      .send({ message: err.message }));
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
  }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(err.name === 'CastError' ? StatusCodes.NOT_FOUND : StatusCodes.SERVER_ERROR)
      .send({ message: err.message }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(StatusCodes.INVALID_DATA)
      .send({ message: 'invalid data' });
    return;
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(err.name === 'CastError' ? StatusCodes.NOT_FOUND : StatusCodes.SERVER_ERROR)
      .send({ message: err.message }));
};
