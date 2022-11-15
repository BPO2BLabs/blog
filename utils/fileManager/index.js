require('dotenv').config()
const { uuid } = require('uuidv4')
const { s3Client } = require('../awsClient/index')

function upload (document) {
  const name = uuid()
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: document.data,
      Key: name
    }
    s3Client.upload(params)
    return name
  } catch (err) {
    throw new Error(err)
  }
}

function download (name) {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: name
    }
    return s3Client.getObject(params)
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  upload,
  download
}
