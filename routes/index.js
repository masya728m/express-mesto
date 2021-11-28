const router = require('express')
  .Router();
const bodyParser = require('body-parser');
const {
  celebrate,
  Joi
} = require('celebrate');
const {
  login,
  createUser
} = require('../controllers/users');
const auth = require('../middlewares/auth');

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
        .required()
        .min(2)
        .max(30),
      about: Joi.string()
        .required()
        .min(2)
        .max(50),
      avatar: Joi.string()
        .required()
        .uri(),
      email: Joi.string()
        .required()
        .uri(),
      password: Joi.string()
        .required()
        .min(7)
    })
}), createUser);
router.use(auth);
router.use('/cards', require('./cards'));
router.use('/users', require('./users'));

module.exports = router;
