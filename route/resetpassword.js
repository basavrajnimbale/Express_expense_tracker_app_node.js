const express = require('express');

const resetpasswordController = require('../controller/resetpassword');

const userauthentication = require('../middleware/auth')

const route = express.Router();

route.use('/forgotpassword', userauthentication.authenticate, resetpasswordController.forgotpassword)

route.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

route.get('/resetpassword/:id', resetpasswordController.resetpassword)

module.exports = route;