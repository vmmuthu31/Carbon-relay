const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const XLSX = require("xlsx");
const verifyToken = require("../middleware/verifyToken");
const Admin = require("../models/Admin");
const Trader = require("../models/Trader");

const ProjectData = require("../models/projectDataModel");
const Offer = require("../models/Offer");
const { Bid } = require("../models/Bids");

router.use(fileUpload());
router.post("/uploadProjectData", async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const file = req.files.file;
  let workbook;
  try {
    workbook = XLSX.read(file.data, { type: "buffer" });
  } catch (error) {
    console.error("Error reading Excel file:", error);
    return res.status(400).json({ error: "Invalid Excel file format." });
  }

  const sheet_name_list = workbook.SheetNames;
  if (!sheet_name_list.length) {
    return res.status(400).json({ error: "Excel file has no sheets." });
  }

  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  if (!data.length) {
    return res.status(400).json({ error: "Sheet has no data." });
  }

  const processedData = data.map((datum) => {
    // Compute Project ID
    const projectID = `${datum["Standard"]}${datum["ID"]}`;

    // Return the processed object
    return {
      ProjectID: projectID,
      Standard: datum["Standard"],
      ID: datum["ID"],
      Name: datum["Name"],
      Proponent: datum["Proponent"],
      ProjectType: datum["Project Type"],
      Methodology: datum["Methodology"],
      Country_Area: datum["Country/Area"],
      SDGs: datum["SDGs"],
      AdditionalAttributes: {
        Attribute1: datum["Additional Attribute 1"] || null,
        Attribute2: datum["Additional Attribute 2"] || null,
        Attribute3: datum["Additional Attribute 3"] || null,
      },
    };
  });

  try {
    await ProjectData.insertMany(processedData);
    res
      .status(200)
      .json({ message: "Project data uploaded and processed successfully." });
  } catch (error) {
    console.error("Error processing project data:", error);
    res.status(500).json({ error: "Error processing project data." });
  }
});

router.get("/projectData/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params; // Extract the projectId from route parameters

    // Find project data by projectId
    const projectData = await ProjectData.findOne({ ProjectID: projectId });

    // If no data is found, return a 404 error
    if (!projectData) {
      return res.status(404).json({ error: "Project data not found." });
    }

    // If data is found, return it
    res.status(200).json(projectData);
  } catch (error) {
    console.error("Error fetching project data:", error);
    res.status(500).json({ error: "Error fetching project data." });
  }
});

router.post("/offers", verifyToken, async (req, res) => {
  try {
    // Extract user from the token
    const user = req.user;

    // Create the offer with the associated user's ID
    const offer = new Offer({
      ...req.body,
      createdBy: user.userId,
      onModel: user.userType,
    });

    await offer.save();
    res.status(201).send(offer);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET route to retrieve all offers
router.get("/myoffers", verifyToken, async (req, res) => {
  try {
    const user = req.user;

    let offers = [];

    if (user.userType === "Admin") {
      // Fetch offers created by the admin
      const adminOffers = await Offer.find({
        createdBy: user.userId,
        onModel: "Admin",
      });

      // Fetch traders associated with the admin's company
      const tradersOfCompany = await Trader.find({ admin: user.userId });
      const traderIds = tradersOfCompany.map((trader) => trader._id);

      // Fetch offers created by traders of the same company/admin
      const traderOffers = await Offer.find({
        createdBy: { $in: traderIds },
        onModel: "Trader",
      });

      offers = adminOffers.concat(traderOffers);
    } else if (user.userType === "Trader") {
      // Fetch offers created by the trader
      offers = await Offer.find({ createdBy: user.userId, onModel: "Trader" });
    }

    res.status(200).send(offers);
  } catch (error) {
    console.error("Error fetching offers:", error);
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
});

// POST route to create a bid for an offer
router.post("/create-bid/:offerId", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const offerId = req.params.offerId;
    const { traderId, traderCompanyName, bidAmount, status, operation } =
      req.body;

    // Fetch the offer to ensure it exists
    const offer = await Offer.findOne({ _id: offerId });

    if (!offer) {
      return res.status(404).json({ error: "Offer not found" });
    }

    // Check if the user making the request is the one who created the offer
    if (offer.createdBy.toString() === user.userId) {
      // If the user created the offer, they are not allowed to bid on it
      return res
        .status(403)
        .json({ error: "You cannot bid on your own offer" });
    }

    // If the check passes, proceed with creating a bid
    const bid = new Bid({
      offerId,
      traderId, // This should be the ID of the user making the request (i.e., the bidder)
      traderCompanyName, // Include the trader's company name
      bidAmount,
      status: status || "Active", // Default to "Active" if status is not provided
      operation: operation || "Evaluating", // Default to "Evaluating" if operation is not provided
    });

    await bid.save(); // Save the bid to the database

    // Once the bid is created, you can return a success response or any relevant data.
    return res.status(201).json({ message: "Bid created successfully" });
  } catch (error) {
    console.error("Error creating bid:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the bid" });
  }
});

router.get("/get-bids/:offerId", verifyToken, async (req, res) => {
  try {
    const user = req.user;
    const offerId = req.params.offerId;

    // Fetch the offer to ensure it belongs to the user
    const offer = await Offer.findOne({ _id: offerId, createdBy: user.userId });

    if (!offer) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Fetch all bids associated with the offer from the database, including status and operation.
    const bids = await Bid.find({ offerId });

    // Return the list of bids in the response.
    return res.status(200).json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching bids" });
  }
});

module.exports = router;
