const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");
const Trader = require("../models/Trader");
const router = express.Router();

// Signup route for admin
router.post("/signup", async (req, res) => {
  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const admin = new Admin({
      ...req.body,
      password: hashedPassword,
    });
    await admin.save();
    res.status(201).send({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Invite trader by admin
router.post("/invite", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.adminEmail });
    if (!admin) {
      return res.status(404).send({ error: "Admin not found" });
    }

    // Generate a random password for the trader
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Extract trader's name from the email
    const traderName = req.body.traderEmail.split("@")[0];
    const adminEmail = req.body.adminEmail;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "zkconnectt@gmail.com",
        pass: "yslzyadcmvewlmmn",
      },
    });
    const mailOptions = {
      from: "carbon-relay@gmail.com",
      to: req.body.traderEmail,
      subject: "Invitation to join the Carbon-Relay Dashboard",
      text: `Hi ${traderName},

You have been invited to the Carbon-Relay Dashboard by ${adminEmail}. 

Link to the page: [Your Dashboard Link Here]

Password: ${randomPassword}`,
    };

    await transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).send({ error: error.message });
      }

      const trader = new Trader({
        companyName: admin.companyName,
        email: req.body.traderEmail,
        password: hashedPassword,
      });
      await trader.save();

      res.send({ message: "Invitation sent successfully" });
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists in either Admin or Trader collections
    let user = await Admin.findOne({ email });
    if (!user) {
      user = await Trader.findOne({ email });
    }

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Invalid password" });
    }

    // If everything is okay, send a success message (or a token if you're implementing JWT authentication)
    res.send({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
