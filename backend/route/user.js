const express = require('express');

const route = express.Router();

const User = require('../controller/user');

route.post('/signup', User.postuser);

module.exports = route;