const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const userModel = require("./models/user.model");
const rideModel = require("./models/ride.model");
const captainModel = require("./models/captain.model");
const frontendLogModel = require("./models/frontend-log.model");
const blacklistTokenModel = require("./models/blacklistToken.model");
const { getAllowedOrigins } = require("./config/cors");

let io;

// returns { id, userType } or null
async function verifySocketToken(token) {
  if (!token) return null;
  try {
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !["user", "captain"].includes(decoded.userType)) return null;
    return { id: String(decoded.id), userType: decoded.userType };
  } catch (error) {
    return null;
  }
}

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: getAllowedOrigins(),
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    if (process.env.ENVIRONMENT == "production") {
      socket.on("log", async (log) => {
        log.formattedTimestamp = moment().tz("Asia/Kolkata").format("MMM DD hh:mm:ss A");
        try {
          await frontendLogModel.create(log);
        } catch (error) {
          console.log("Error sending logs...");
        }
      });
    }

    // id comes from the token, not the payload
    socket.on("join", async ({ token } = {}) => {
      const auth = await verifySocketToken(token);
      if (!auth) {
        return socket.emit("error", { message: "Unauthorized socket" });
      }

      socket.data.userId = auth.id;
      socket.data.userType = auth.userType;

      try {
        const model = auth.userType === "user" ? userModel : captainModel;
        await model.findByIdAndUpdate(auth.id, { socketId: socket.id });
        console.log(auth.userType + " connected: " + auth.id);
      } catch (error) {
        console.log("Error saving socket id:", error.message);
      }
    });

    socket.on("update-location-captain", async (data = {}) => {
      const { location } = data;

      if (socket.data.userType !== "captain") {
        return socket.emit("error", { message: "Unauthorized" });
      }
      if (!location || typeof location.ltd !== "number" || typeof location.lng !== "number") {
        return socket.emit("error", { message: "Invalid location data" });
      }

      try {
        await captainModel.findByIdAndUpdate(socket.data.userId, {
          location: {
            type: "Point",
            coordinates: [location.lng, location.ltd], // GeoJSON order: [lng, lat]
          },
        });
      } catch (error) {
        console.log("Error updating captain location:", error.message);
      }
    });

    // only the rider / captain of the ride can join its room
    socket.on("join-room", async ({ rideId, token } = {}) => {
      const auth = await verifySocketToken(token);
      if (!auth || !rideId) {
        return socket.emit("error", { message: "Unauthorized" });
      }

      try {
        const ride = await rideModel.findById(rideId).select("user captain");
        const isMember =
          ride &&
          (String(ride.user) === auth.id || (ride.captain && String(ride.captain) === auth.id));
        if (!isMember) {
          return socket.emit("error", { message: "You are not part of this ride" });
        }

        socket.data.userId = auth.id;
        socket.data.userType = auth.userType;
        socket.join(String(rideId));
        console.log(`${socket.id} joined room: ${rideId}`);
      } catch (error) {
        socket.emit("error", { message: "Could not join ride chat" });
      }
    });

    socket.on("message", async ({ rideId, msg, time } = {}) => {
      if (!rideId || !socket.rooms.has(String(rideId))) {
        return socket.emit("error", { message: "Join the ride chat first" });
      }
      if (typeof msg !== "string" || !msg.trim() || msg.length > 1000) {
        return socket.emit("error", { message: "Invalid message" });
      }

      const by = socket.data.userType;
      const date = moment().tz("Asia/Kolkata").format("MMM DD");
      socket.to(String(rideId)).emit("receiveMessage", { msg, by, time });

      try {
        await rideModel.updateOne(
          { _id: rideId },
          { $push: { messages: { msg, by, time, date, timestamp: new Date() } } }
        );
      } catch (error) {
        console.log("Error saving message: ", error.message);
      }
    });
  });
}

const sendMessageToSocketId = (socketId, messageObject) => {
  if (!socketId) return;
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.log("Socket.io not initialized.");
  }
};

module.exports = { initializeSocket, sendMessageToSocketId };
