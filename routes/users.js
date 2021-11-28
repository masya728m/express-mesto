const router = require('express')
  .Router();
const {
  celebrate,
  Joi
} = require('celebrate');
const {
  getUsers,
  getUser,
  updateUserProfile,
  updateUserAvatar
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:id', getUser);
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
        .uri()
    })
}), updateUserAvatar);

module.exports = router;
