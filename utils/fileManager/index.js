require('dotenv').config()
const { uuid } = require('uuidv4')
const { s3Client } = require('../awsClient/index')

function upload (document) {
  const name = uuid()
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Body: document.data,
    Key: name,
    Metadata: {
      name: document.name,
      type: document.mimetype
    }
  }

  return new Promise((resolve, reject) => {
    try {
      s3Client.upload(params, (err, data) => {
        if (err) { reject(err) }
        resolve(data.Key)
      })
    } catch (err) {
      reject(err)
    }
  })
}

async function download (name) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: name
  }
  const metadata = await s3Client.headObject(params).promise()
  const pipe = s3Client.getObject(params).createReadStream()

  const response = {
    name: metadata.Metadata.name,
    type: metadata.Metadata.type,
    pipe
  }

  return response
}

async function uploadFiles (files) {
  const filesArray = []

  if (files && files.attachment && files.attachment.length > 0) {
    const { attachment } = files
    const result = await Promise.all(attachment.map((singleFile) => upload(singleFile)))
    filesArray.push(...result)
  } else if (files && files.attachment) {
    const result = await upload(files.attachment)
    filesArray.push(result)
  }

  return filesArray
}

module.exports = {
  upload,
  download,
  uploadFiles
}
