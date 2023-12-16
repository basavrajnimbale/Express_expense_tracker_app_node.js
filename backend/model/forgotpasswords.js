const { Sequelize } = require('sequelize'); 
const sequelize = require('../util/database');

const ForgotPasswordRequest = sequelize.define('forgotpasswordrequest', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE
})

module.exports = ForgotPasswordRequest;