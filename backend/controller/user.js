const User = require('../model/users');

function isstringinvalid(string){
    if(string == undefined || string.length == 0){
        return true
    } else {
        return false
    }
}

exports.postuser = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "bad parameter. something is missing"})
        }

        const newUser = await User.create({
            name,
            email,
            password
        });
        console.log(newUser + 'hiiii');
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).json(error);
    }
};
