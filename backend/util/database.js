const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'Basavraj@123', {
    dialect: 'mysql',
    host: 'localhost',
    logging: false
});

module.exports = sequelize;

/*try{
    sequelize.authenticate();
    console.log('connect')
} catch(error){
    console.log(err);
}

const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'expense',
    password: 'Basavraj@123'
})

module.exports = pool.promise()*/