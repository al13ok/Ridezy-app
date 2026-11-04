const userModel = require("../models/user.model");

// demo rider for the "try instantly" button, password is public on purpose
const demoUsers = [
  {
    fullname: { firstname: "Demo", lastname: "Rider" },
    email: "demo.rider@Ridezy-demo.com",
    password: "demopassword123",
    phone: "9999900000",
    emailVerified: true,
  },
];

async function seedDemoUsers() {
  try {
    for (const userData of demoUsers) {
      const exists = await userModel.findOne({ email: userData.email });
      if (!exists) {
        const hashedPassword = await userModel.hashPassword(userData.password);
        await userModel.create({ ...userData, password: hashedPassword });
        console.log(`Demo rider ${userData.email} seeded successfully.`);
      }
    }
  } catch (error) {
    console.error("Error seeding demo users:", error);
  }
}

module.exports = { demoUsers, seedDemoUsers };
