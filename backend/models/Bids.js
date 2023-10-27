const mongoose = require("mongoose");

// Define possible bid statuses and operations
const bidStatusEnum = ["Active", "Withdraw", "Rejected"];
const bidOperationEnum = ["Evaluating", "OnHold", "Active", "Reject"];

const bidSchema = new mongoose.Schema({
  offerId: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" }, // Reference to the Offer
  traderId: String,
  bidAmount: Number,
  traderCompany: String,
  status: {
    type: String,
    enum: bidStatusEnum,
    default: "Active", // Default status is Active
  },
  operation: {
    type: String,
    enum: bidOperationEnum,
    default: "Evaluating", // Default operation is Evaluating
  },
});

const Bid = mongoose.model("Bid", bidSchema);

module.exports = { Bid };
