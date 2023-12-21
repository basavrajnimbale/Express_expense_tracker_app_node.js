const AWS = require('aws-sdk');

const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetracking-app';
    console.log(process.env.IAM_USER_KEY, 'in uploadtoS3 function');
    console.log(process.env.IAM_USER_SECRET, 'in uploadtoS3 function');

    let s3bucket = new AWS.S3({
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }
    return new Promise((reslove, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if (err) {
                console.log('Something went wrong', err)
                reject(err)
            }else {
                console.log('success', s3response)
                reslove(s3response.Location);
            }
        })
    })
}

module.exports = {
    uploadToS3
}