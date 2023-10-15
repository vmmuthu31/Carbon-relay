const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"], // Multiple origins in an array
    methods: ["GET", "POST"],
  },
});

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.rxnpu.mongodb.net/Cdash-V2",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const ChatSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: Date,
});

const Chat = mongoose.model("Chat", ChatSchema);
let users = {}; // user ID -> socket mapping

io.on("connection", (socket) => {
  console.log("a user connected");

  // When a user logs in or joins the chat:
  socket.on("user joined", (userID) => {
    users[userID] = socket; // store the user's socket in the 'users' dictionary
    socket.emit("private message", {
      id: Date.now(),
      from: "Server",
      to: userID,
      message: "How can we help? We're here for you!",
      timestamp: new Date(),
    });
  });

  socket.on("private message", (messageObj) => {
    // Create a new chat instance with the received message
    const chat = new Chat({
      username: messageObj.from,
      message: messageObj.message,
      timestamp: messageObj.timestamp, // use the timestamp from the sent message
    });

    chat
      .save()
      .then(() => {
        // Assuming 'users' is a dictionary with userIDs as keys and their respective sockets as values
        const toSocket = users[messageObj.to];
        if (toSocket) {
          // Forward the complete message object to the intended recipient
        } else {
          console.warn(`User ${messageObj.to} is not connected.`);
        }
      })
      .catch((err) => {
        console.error("Failed to save chat:", err);
      });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    // Remove the user from the mapping when they disconnect
    for (let userID in users) {
      if (users[userID] === socket) {
        delete users[userID];
        break;
      }
    }
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
