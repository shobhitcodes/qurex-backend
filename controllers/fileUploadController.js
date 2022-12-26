'use strict';

const utils = require('../helpers/utils');
const AWS = require('aws-sdk');

const AWS_ACCESS_KEY_ID = "AKIAUKXOLSUHUS7467N3";
const AWS_SECRET_ACCESS_KEY = "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";
const S3BucketName = "comicaislebucketprod";
const AWS_REGION = "ap-south-1";

// const AWS_REGION = process.env.AWS_REGION;
// const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
// const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
// const S3BucketName = process.env.S3BucketName;

AWS.config = new AWS.Config({
    region: AWS_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
});

const s3 = new AWS.S3()

module.exports.getFileUploadSignedUrl = getFileUploadSignedUrl;

/**
 * @async
 * @description Request handler for registering Doc
 * @param {Express.Request} req
 * @param {Express.Response} res
 */
async function getFileUploadSignedUrl(req, res) {
    try {
        const { fileName } = req.params;
        const signedUrl = getS3SignedUrl(`${fileName}`);
        if (signedUrl) {
            res.json(utils.formatResponse(1, signedUrl));
        } else {
            throw 'Unable to upload Image';
        }
    } catch (error) {
        console.error('Error on File Upload handler: ', error);
        res.json(utils.formatResponse(0, error));
    }
}

const getS3SignedUrl = (fileName) => {
    const signedUrl = s3.getSignedUrl('putObject', {
        Key: fileName,
        Bucket: S3BucketName,
        ACL: 'public-read',
        Expires: 60 * 60 || 900, // S3 default is 900 seconds (15 minutes)
    });
    return signedUrl;
};
