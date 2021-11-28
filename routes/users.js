const router = require('express')
  .Router();
const {
  celebrate,
  Joi
} = require('celebrate');
const validator = require('validator');
const {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar
} = require('../controllers/users');
const InvalidDataError = require('../errors/invalidDataError');

router.get('/', getUsers);
router.get('/me', getUser);

router.get('/:id', celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string()
        .length(24)
        .hex()
    })
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .required()
        .min(2),
      about: Joi.string()
        .required()
        .min(2)
        .max(50)
    })
}), updateUserProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object()
    .keys({
      avatar: Joi.string()
        .required()
        .custom((value) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            throw new InvalidDataError('Failed to validate avatar field');
          }
          return value;
        })
    })
}), updateUserAvatar);

module.exports = router;
