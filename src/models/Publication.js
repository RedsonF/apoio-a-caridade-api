const { Schema, model } = require('mongoose');

const PublicationSchema = new Schema(
  {
    idInstitution: {
      type: Schema.Types.ObjectId,
      ref: 'Institution',
      required: true,
    },
    typeInstitution: {
      type: String,
      required: true,
    },
    nameInstitution: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    likes: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = model('Publication', PublicationSchema);
