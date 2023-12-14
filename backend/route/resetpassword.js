const express = require('express');

const resetpasswordController = require('../controller/resetpassword');

const route = express.Router();

route.use('/forgotpassword', resetpasswordController.forgotpassword)

module.exports = route;