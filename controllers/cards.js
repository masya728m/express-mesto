const Card = require('../models/card');
const StatusCodes = require('../utils/statusCodes');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(StatusCodes.SERVER_ERROR)
      .send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const {
    name,
    link
  } = req.body;
  if (!name || !link || !owner) {
    res.status(StatusCodes.INVALID_DATA)
      .send({ message: 'invalid data' });
    return;
  }
  Card.create({
    name,
    link,
    owner
  })
    .then((card) => res.send(card))
    .catch((err) => res.status(StatusCodes.SERVER_ERROR)
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
        res.status(StatusCodes.NOT_FOUND)
          .send({ message: 'no such card' });
      }
      res.send();
    })
    .catch((err) => res.status(StatusCodes.SERVER_ERROR)
      .send({ message: err.message }));
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  if (!userId) {
    res.status(StatusCodes.INVALID_DATA)
      .send({ message: 'invalid data' });
    return;
  }
  if (!cardId) {
    res.status(StatusCodes.NOT_FOUND)
      .send({ message: 'invalid data' });
    return;
  }
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(StatusCodes.SERVER_ERROR)
      .send({ message: err.message }));
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  if (!userId) {
    res.status(StatusCodes.INVALID_DATA)
      .send({ message: 'invalid data' });
    return;
  }
  if (!cardId) {
    res.status(StatusCodes.NOT_FOUND)
      .send({ message: 'invalid data' });
    return;
  }
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => res.status(StatusCodes.SERVER_ERROR)
      .send({ message: err.message }));
};
