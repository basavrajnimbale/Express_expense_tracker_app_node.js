const express = require('express');

const route = express.Router();

const User = require('../controller/user');

route.post('/signup', User.postuser);

route.post('/login', User.login);

module.exports = route;