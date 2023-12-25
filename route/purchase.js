const express = require('express');

const route = express.Router();

const userauthentication = require('../middleware/auth')

const purchaseController = require('../controller/purchase')

route.get('/premiummembership', userauthentication.authenticate, purchaseController.purchasepremium)

route.post('/updatetransactionstatus', userauthentication.authenticate, purchaseController.updateTransactionStatus)

module.exports = route;

