require('dotenv')
  .config();
const express = require('express');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/notFoundError');

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/'
} = process.env;

const app = express();

app.use(require('./routes/index'));

app.use((req, res, next) => next(new NotFoundError('not found')));

app.use(require('./middlewares/error'));

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
