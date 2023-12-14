const Sib = require('sib-api-v3-sdk');
const User = require('../model/users');

exports.forgotpassword = async (req, res, next) => {
    try{
        const {email} = req.body;
        console.log(email);

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SIB_API_KEY;

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'nimbalebasavraj1@gmail.com',
            name: 'Basavraj Enterprise'
        };
        const receivers = [
            {
                email: 'shantanimbale@gmail.com'
            }
        ];
        const result = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: `Confirmation mail to reset password`,
            htmlContent: `<p>Click below to reset password!</p><a href='something.com'>RESET PASSWORD</a> `
        });

        console.log(result);
        res.status(202).json({result});

    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}