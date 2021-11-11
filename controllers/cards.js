const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(404)
      .send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const {
    name,
    link
  } = req.body;
  Card.create({
    name,
    link,
    owner
  })
    .then((card) => res.send(card))
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.deleteOne({
    _id: cardId,
    owner
  })
    .then((result) => {
      if (!result.deletedCount) {
        res.status(404)
          .send({ message: 'no such card' });
      }
      res.send();
    })
    .catch((err) => res.status(500)
      .send({ message: err.message }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true }
)
  .then((card) => res.send(card))
  .catch((err) => res.status(500)
    .send({ message: err.message }));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true }
)
  .then((card) => res.send(card))
  .catch((err) => res.status(500)
    .send({ message: err.message }));
