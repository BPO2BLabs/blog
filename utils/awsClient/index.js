require('dotenv').config()
const AWS = require('aws-sdk')

const config = {
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

const s3Client = new AWS.S3(config)
module.exports = { s3Client }
