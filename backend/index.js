require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const projRoutes = require("./routes/data");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", projRoutes);
app.use("/api", userRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Chat schema and model
const ChatSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: Date,
});
const Chat = mongoose.model("Chat", ChatSchema);

// WebSocket server setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let users = {};

wss.on("connection", (ws) => {
  console.log("A user connected");

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      // Basic validation
      if (!data.type) {
        throw new Error("Type is required in message");
      }

      if (data.type === "user joined") {
        const userID = data.userID;
        users[userID] = ws;
        console.log(`User ${userID} joined`);
      } else if (data.type === "private message") {
        const chat = new Chat({
          username: data.from,
          message: data.message,
          timestamp: data.timestamp,
        });

        chat
          .save()
          .then(() => {
            const toSocket = users[data.to];
            if (toSocket && toSocket.readyState === WebSocket.OPEN) {
              toSocket.send(JSON.stringify(data));
            } else {
              console.warn(`User ${data.to} is not connected.`);
            }
          })
          .catch((err) => console.error("Failed to save chat:", err));
      }
    } catch (err) {
      console.error("Error handling message:", err.message);
    }
  });

  ws.on("close", () => {
    console.log("User disconnected");
    Object.keys(users).forEach((userID) => {
      if (users[userID] === ws) {
        delete users[userID];
      }
    });
  });
});

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
