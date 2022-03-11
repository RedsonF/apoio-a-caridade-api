const { Schema, model } = require('mongoose');
const Location = require('./Location');
const DonationData = require('./DonationData');

const InstitutionSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/, 'Formato inválido'],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: Location,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    cnpj: {
      type: String,
      required: true,
    },
    logoImage: {
      type: String,
      required: false,
    },
    coverImage: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    donationData: {
      type: DonationData,
      required: false,
      default: {},
    },
    tokens: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = model('Institution', InstitutionSchema);
