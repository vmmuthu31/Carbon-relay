// models/Offer.js

const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  projectId: String,
  quantity: Number,
  startingYear: Number,
  endingYear: Number,
  offerPrice: Number,
  corisa: String,
  projectName: String,
  projectType: String,
  proponent: String,
  country: String,
  methodology: String,
  sdgs: String,
  additionalCertificates1: String,
  additionalCertificates2: String,
  additionalCertificates3: String,
  createdBy: {
    type: String,
    required: true,
  },
  onModel: {
    type: String,
    required: true,
    enum: ["Admin", "Trader"],
  },
  bids: [
    {
      type: String,
      required: true,
    },
  ],
  creationDate: {
    type: Date, // Add a creationDate field of type Date
    default: Date.now, // Set a default value to the current date and time
  },
});

module.exports = mongoose.model("Offer", offerSchema);
