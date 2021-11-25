const Card = require('../models/card');
const StatusCodes = require('../utils/statusCodes');
const InvalidDataError = require('../errors/invalidDataError');
const NotFoundError = require('../errors/notFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;
  const {
    name,
    link
  } = req.body;
  if (!name || !link || !owner) {
    next(new InvalidDataError('invalid data'));
    return;
  }
  Card.create({
    name,
    link,
    owner
  })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.deleteOne({
    _id: cardId,
    owner
  })
    .then((result) => {
      if (!result.deletedCount) {
        next(new NotFoundError('no such card'));
        return;
      }
      res.status(200)
        .send({ message: 'Card has been successfully deleted' });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  if (!userId || !cardId) {
    next(new InvalidDataError('invalid data'));
  }
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      next(new NotFoundError('no such card'));
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { userId } = req.user;

  if (!userId) {
    next(new InvalidDataError('invalid data'));
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
    .orFail(() => {
      next(new NotFoundError('no such card'));
    })
    .then((card) => res.send(card))
    .catch(next);
};
