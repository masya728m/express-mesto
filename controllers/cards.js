const Card = require('../models/card');
const InvalidDataError = require('../errors/invalidDataError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

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
  Card.create({
    name,
    link,
    owner
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new InvalidDataError('invalid data'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findById(cardId)
    .orFail(() => next(new NotFoundError('No such card')))
    .then((card) => {
      if (!card.owner.equals(owner)) {
        return next(new ForbiddenError('Attempt to delete not your card'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Card has been successfully deleted' }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
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
  const userId = req.user._id;
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
