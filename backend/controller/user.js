const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isstringinvalid(string) {
    if (string == undefined || string.length == 0) {
        return true
    } else {
        return false
    }
}

const Signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ err: "bad parameter. something is missing" })
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            console.log(err)
            await User.create({ name, email, password: hash });
            res.status(201).json({ message: 'Successfuly create new user' });
        })
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

function generateAccessToken (id, name, ispremiumuser) {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, process.env.TOKEN_SECRET)
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ message: 'Email id or password missing', success: false })
        }
        const user = await User.findAll({ where: { email } })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.status(500).json({ success: false, message: 'Something wend wrong' })
                }
                if (result == true) {
                    res.status(200).json({ success: true, message: "user logged in successfully", token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser) })
                }
                else {
                    return res.status(400).json({ success: false, message: 'password is incorrect' })
                }
            })
        } else {
            return res.status(404).json({ success: false, message: 'user doesnot exitst' })
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false })
    }
}

 module.exports = {
    Signup,
    login,
    generateAccessToken
}
