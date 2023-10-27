const mongoose = require("mongoose");

// Define a Bid schema
const bidSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }, // Reference to the Offer
  traderId: String,
  bidAmount: Number,
  traderCompany: String,
});

const Bid = mongoose.model("Bid", bidSchema);

module.exports = { Bid };
