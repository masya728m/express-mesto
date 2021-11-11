const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(400)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => res.send(user))
    .catch((err) => res.status(err.name === 'CastError' ? 404 : 500)
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
    .catch((err) => res.status(400)
      .send({ message: err.message }));
};

module.exports.updateUserProfile = (req, res) => {
  const {
    name,
    about
  } = req.body;
  if (!name || !about) {
    res.status(400)
      .send({ message: 'invalid data' });
    return;
  }
  User.findByIdAndUpdate(req.user._id, {
    name,
    about
  }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(err.name === 'CastError' ? 404 : 500)
      .send({ message: err.message }));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(400)
      .send({ message: 'invalid data' });
    return;
  }
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => res.status(err.name === 'CastError' ? 404 : 500)
      .send({ message: err.message }));
};
