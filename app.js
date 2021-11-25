require('dotenv')
  .config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const StatusCodes = require('./utils/statusCodes');
const auth = require('./middlewares/auth');
const {
  login,
  createUser
} = require('./controllers/users');

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/'
} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND)
    .send({ message: 'not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const reservedErrorNames = [
    'ValidationError',
    'MongoServerError',
    'CastError'
  ];
  if (err.statusCode) {
    return res.status(err.statusCode)
      .send({ message: err.message });
  }
  if (reservedErrorNames.some((error) => error === err.name)) {
    return res.status(StatusCodes.INVALID_DATA)
      .send({ message: 'invalid data' });
  }
  if (err.name === 'MongoError' && err.code === 11000) {
    return res.status(StatusCodes.FORBIDDEN)
      .send({ message: 'Attempt to create duplicate entry' });
  }
  return res.status(StatusCodes.SERVER_ERROR)
    .send(err.message);
});

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect(DB_URL, options, (err) => {
  if (err) {
    console.log('Unable to connect to the server. Please start the server. Error:', err);
    return;
  }
  console.log(`Connected to database ${DB_URL}`);
  app.listen(PORT, () => {
    console.log(`App has been started on port ${PORT}`);
  });
});
