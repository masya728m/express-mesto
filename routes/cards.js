const router = require('express')
  .Router();
const validator = require('validator');
const {
  celebrate,
  Joi
} = require('celebrate');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard
} = require('../controllers/cards');
const InvalidDataError = require('../errors/invalidDataError');

router.get('/', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .length(24)
        .hex()
    })
}), deleteCard);
router.post('/', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2),
      link: Joi.string()
        .required()
        .custom((value) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            throw new InvalidDataError('Failed to validate link field');
          }
          return value;
        })
    })
}), createCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .length(24)
        .hex()
    })
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .length(24)
        .hex()
    })
}), dislikeCard);

module.exports = router;
