const captainModel = require("../models/captain.model");

const demoCaptains = [
  {
    fullname: { firstname: "Abhinav", lastname: "Raj" },
    email: "abhinav.raj@Ridezy-demo.com",
    password: "demopassword123",
    phone: "9999900001",
    status: "active",
    vehicle: {
      color: "Black",
      number: "BR85 1204",
      capacity: 1,
      type: "bike"
    },
    location: {
      type: "Point",
      coordinates: [77.2090, 28.6139]
    },
    emailVerified: true
  },
  {
    fullname: { firstname: "Rohit", lastname: "Kumar" },
    email: "rohit.kumar@Ridezy-demo.com",
    password: "demopassword123",
    phone: "9999900002",
    status: "active",
    vehicle: {
      color: "Blue",
      number: "DL12 BK4321",
      capacity: 1,
      type: "bike"
    },
    location: {
      type: "Point",
      coordinates: [77.2190, 28.6239]
    },
    emailVerified: true
  },
  {
    fullname: { firstname: "Aman", lastname: "Singh" },
    email: "aman.singh@Ridezy-demo.com",
    password: "demopassword123",
    phone: "9999900003",
    status: "active",
    vehicle: {
      color: "White",
      number: "HR26 AA1111",
      capacity: 4,
      type: "car"
    },
    location: {
      type: "Point",
      coordinates: [77.2290, 28.6339]
    },
    emailVerified: true
  },
  {
    fullname: { firstname: "Rahul", lastname: "Verma" },
    email: "rahul.verma@Ridezy-demo.com",
    password: "demopassword123",
    phone: "9999900004",
    status: "active",
    vehicle: {
      color: "Yellow",
      number: "UP16 ZZ9999",
      capacity: 3,
      type: "auto"
    },
    location: {
      type: "Point",
      coordinates: [77.2390, 28.6439]
    },
    emailVerified: true
  },
  {
    fullname: { firstname: "Vikash", lastname: "Sharma" },
    email: "vikash.sharma@Ridezy-demo.com",
    password: "demopassword123",
    phone: "9999900005",
    status: "active",
    vehicle: {
      color: "Silver",
      number: "BR01 CC7777",
      capacity: 4,
      type: "car"
    },
    location: {
      type: "Point",
      coordinates: [77.2490, 28.6539]
    },
    emailVerified: true
  }
];

async function seedDemoCaptains() {
  try {
    for (const captainData of demoCaptains) {
      const exists = await captainModel.findOne({ email: captainData.email });
      if (!exists) {
        const hashedPassword = await captainModel.hashPassword(captainData.password);
        await captainModel.create({
          ...captainData,
          password: hashedPassword,
        });
        console.log(`Demo captain ${captainData.fullname.firstname} ${captainData.fullname.lastname} seeded successfully.`);
      }
    }
  } catch (error) {
    console.error("Error seeding demo captains:", error);
  }
}

module.exports = {
  demoCaptains,
  seedDemoCaptains
};
