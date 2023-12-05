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

exports.login = async (req, res, next) => {
    const { email, password} = req.body;
    if(isstringinvalid(email) || isstringinvalid(password)){
        return res.status(400).json({message: 'Email id or password missing', success: false})
    }
    User.findAll({ where : {email}}).then(newUser => {
        if(newUser.length > 0){
            if(newUser[0].password === password){
                res.status(200).json({success: true, message: "user logged in successfully"})
            } else {
                return res.status(400).json({success: false, message: 'password is incorrect'})
            }
        } else {
            return res.status(404).json({success: false, message:'user doesnot exitst'})
        }
    }).catch(err => {
        res.status(500).json({message: err, success:false})
    })
}
