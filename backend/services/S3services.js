const AWS = require('aws-sdk');

const uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expensetracking-app';
    const IAM_USER_KEY = 'AKIA5YC6GOW73TDGSZW5';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME
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