const { Schema, model } = require('mongoose');
const Preferences = require('./Preference');

const DonorSchema = new Schema(
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
    preferences: {
      type: Preferences,
      required: true,
    },
    tokens: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = model('Donor', DonorSchema);
