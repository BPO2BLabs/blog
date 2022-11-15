require('dotenv').config()
const { s3Client } = require('../awsClient/index')

module.exports = function uploadDocument (document) {
  const name = `${Date.now()}_${document.name}`
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: document.data,
      Key: name
    }
    s3Client.upload(params, function (err) {
      if (err) { console.log('Error', err) }
    })
    return name
  } catch (err) {
    console.log('Error', err)
  }
}
