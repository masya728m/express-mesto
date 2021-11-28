const router = require('express')
  .Router();
const bodyParser = require('body-parser');
const {
  celebrate,
  Joi
} = require('celebrate');
const validator = require('validator');
const {
  login,
  createUser
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const InvalidDataError = require('../errors/invalidDataError');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(7)
    })
}), login);
router.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string()
        .min(2)
        .max(30),
      about: Joi.string()
        .min(2)
        .max(50),
      avatar: Joi.string()
        .uri()
        .custom((value) => {
          if (!validator.isURL(value, { require_protocol: true })) {
            throw new InvalidDataError('Failed to validate avatar field');
          }
          return value;
        }),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string()
        .required()
        .min(7)
    })
}), createUser);
router.use(auth);
router.use('/cards', require('./cards'));
router.use('/users', require('./users'));

module.exports = router;
