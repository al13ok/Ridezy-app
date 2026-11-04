const mongoose = require("mongoose");

let MONGO_DB = {
  production: { url: process.env.MONGODB_PROD_URL, type: "Atlas" },
  development: { url: process.env.MONGODB_DEV_URL, type: "Compass" },
};

let environment = process.env.ENVIRONMENT;

mongoose
  .connect(MONGO_DB[environment].url)
  .then(async () => {
    console.log("Connected to Mongo DB", MONGO_DB[environment].type);
    try {
      const { seedDemoCaptains } = require("./demoCaptains");
      const { seedDemoUsers } = require("./demoUsers");
      await seedDemoCaptains();
      await seedDemoUsers();
    } catch (err) {
      console.error("Error seeding demo accounts:", err);
    }
  })
  .catch((err) => {
    // Log the real reason (wrong password, IP not whitelisted, cluster paused...)
    console.log("Failed to connect to MongoDB:", err.message);
  });

module.exports = mongoose.connection;
