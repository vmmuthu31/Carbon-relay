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
    type: mongoose.Schema.Types.ObjectId,
    refPath: "onModel",
    required: true,
  },
  onModel: {
    type: String,
    required: true,
    enum: ["Admin", "Trader"],
  },
});

module.exports = mongoose.model("Offer", offerSchema);
