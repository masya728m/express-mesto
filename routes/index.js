const router = require('express')
  .Router();
const bodyParser = require('body-parser');
const {
  login,
  createUser
} = require('../controllers/users');
const auth = require('../middlewares/auth');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.post('/signin', login);
router.post('/signup', createUser);
router.use(auth);
router.use('/cards', require('./cards'));
router.use('/users', require('./users'));

module.exports = router;
