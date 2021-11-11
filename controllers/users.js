const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(404)
      .send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => res.send(user))
    .catch((err) => res.status(400)
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
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.updateUserProfile = (req, res) => User.findByIdAndUpdate(req.user._id, {
  name: req.body.name,
  about: req.body.about
}, { new: true })
  .then((user) => res.send(user))
  .catch((err) => res.status(500)
    .send({ message: err.message }));

module.exports.updateUserAvatar = (req, res) => User.findByIdAndUpdate(req.user._id, {
  avatar: req.body.avatar
}, { new: true })
  .then((user) => res.send(user))
  .catch((err) => res.status(500)
    .send({ message: err.message }));
