const mongoose = require('mongoose');
const aws = require('aws-sdk');
const fs = require('fs');

const s3 = new aws.S3();

const ImageSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ImageSchema.pre('remove', function () {
  return s3
    .deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: this.key,
    })
    .promise()
    .then((response) => {
      console.log(response.status);
    })
    .catch((response) => {
      console.log(response.status);
    });
});

module.exports = mongoose.model('Image', ImageSchema);
