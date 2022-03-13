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

module.exports = mongoose.model('Image', ImageSchema);
