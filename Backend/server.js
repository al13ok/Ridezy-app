require("dotenv").config();

console.log("ENV =", process.env.ENVIRONMENT);
const socket = require("./socket");
const express = require("express");
const { createServer } = require("http");
const app = express();
const server = createServer(app);

socket.initializeSocket(server);

const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const { getAllowedOrigins } = require("./config/cors");

const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const mapsRoutes = require("./routes/maps.routes");
const rideRoutes = require("./routes/ride.routes");
const mailRoutes = require("./routes/mail.routes");
const keepServerRunning = require("./services/active.service");
const dbStream = require("./services/logging.service");
require("./config/db");
const PORT = process.env.PORT || 4000;

if (process.env.ENVIRONMENT == "production") {
    app.use(
        morgan(":method :url :status :response-time ms - :res[content-length]", {
            stream: dbStream,
        })
    );
} else {
    app.use(morgan("dev"));
}
// needed on render so req.ip is the real ip
if (process.env.ENVIRONMENT == "production") {
    app.set("trust proxy", 1);
}
app.use(cors({ origin: getAllowedOrigins() }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.ENVIRONMENT == "production") {
    keepServerRunning();
}

app.get("/", (req, res) => {
    res.json("Hello, World!");
});

app.get("/reload", (req, res) => {
    res.json("Server Reloaded");
});

app.use("/user", userRoutes);
app.use("/captain", captainRoutes);
app.use("/map", mapsRoutes);
app.use("/ride", rideRoutes);
app.use("/mail", mailRoutes);

server.listen(PORT, () => {
    console.log("Server is listening on port", PORT);
});