const userModel = require("../models/user.model");

// Public demo rider so anyone (e.g. an interviewer) can try Ridezy in one click
// without signing up. Its password is published in the frontend on purpose,
// so password reset / profile edits are blocked for demo accounts (see utils/demo.js).
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
