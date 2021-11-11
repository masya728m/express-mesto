const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1:27017/'
} = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '618d88abadfd8cc0ed50d496'
  };
  next();
});
app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

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
