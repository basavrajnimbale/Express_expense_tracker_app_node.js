const express = require('express');

const route = express.Router();

const authenticatemiddleware = require('../middleware/auth')

const premiumFeatureController = require('../controller/premiumFeature')

route.get('/showLeaderBoard', authenticatemiddleware.authenticate, premiumFeatureController.getUserLeaderBoard);

module.exports = route;