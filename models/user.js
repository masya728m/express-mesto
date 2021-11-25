const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const InvalidDataError = require('../errors/invalidDataError');
const UnauthorizedError = require('../errors/unauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 50,
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (val) => {
        const urlRegex = /(https?):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-/]))?/;
        return urlRegex.test(val);
      },
      message: (props) => `${props.value} is not a valid avatar`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: validator.isEmail
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    select: false
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new InvalidDataError('invalid data');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('invalid data');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
