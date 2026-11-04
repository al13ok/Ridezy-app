const captainModel = require("../models/captain.model");
const rideModel = require("../models/ride.model");
const mapService = require("./map.service");
const crypto = require("crypto");

const getFare = async(pickup, destination) => {
    if (!pickup || !destination) {
        throw new Error("Pickup and destination are required");
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        bike: 20,
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        bike: 8,
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        bike: 1.5,
    };

    const fare = {
        auto: Math.round(
            baseFare.auto +
            (distanceTime.distance.value / 1000) * perKmRate.auto +
            (distanceTime.duration.value / 60) * perMinuteRate.auto
        ),
        car: Math.round(
            baseFare.car +
            (distanceTime.distance.value / 1000) * perKmRate.car +
            (distanceTime.duration.value / 60) * perMinuteRate.car
        ),
        bike: Math.round(
            baseFare.bike +
            (distanceTime.distance.value / 1000) * perKmRate.bike +
            (distanceTime.duration.value / 60) * perMinuteRate.bike
        ),
    };

    return { fare, distanceTime };
};

module.exports.getFare = getFare;

function getOtp(num) {
    function generateOtp(num) {
        const otp = crypto
            .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
            .toString();
        return otp;
    }
    return generateOtp(num);
}

module.exports.createRide = async({
    user,
    pickup,
    destination,
    vehicleType,
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("All fields are required");
    }

    try {
        const { fare, distanceTime } = await getFare(pickup, destination);

        const ride = await rideModel.create({
            user,
            pickup,
            destination,
            otp: getOtp(6),
            fare: fare[vehicleType],
            vehicle: vehicleType,
            distance: distanceTime.distance.value,
            duration: distanceTime.duration.value,
        });

        return ride;
    } catch (error) {
        throw new Error("Error occured while creating ride.");
    }
};

// when ride request is accepted by captain
module.exports.confirmRide = async({ rideId, captain }) => {
    if (!rideId) {
        throw new Error("Ride id is required");
    }

    // status: "pending" in the filter makes this atomic, if two captains accept
    // at the same time only one of them gets the ride
    const ride = await rideModel
        .findOneAndUpdate(
            { _id: rideId, status: "pending" },
            { status: "accepted", captain: captain._id },
            { new: true }
        )
        .populate("user")
        .populate("captain")
        .select("+otp");

    if (!ride) {
        const err = new Error("This ride is no longer available. It was accepted, cancelled or completed.");
        err.statusCode = 409;
        throw err;
    }

    await captainModel.updateOne(
        { _id: captain._id },
        { $addToSet: { rides: ride._id } }
    );

    return ride;
};

module.exports.startRide = async({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error("Ride id and OTP are required");
    }

    const ride = await rideModel
        .findOne({
            _id: rideId,
        })
        .populate("user")
        .populate("captain")
        .select("+otp");

    if (!ride) {
        throw new Error("Ride not found");
    }

    // only the assigned captain can start it
    if (captain && ride.captain && String(ride.captain._id) !== String(captain._id)) {
        throw new Error("You are not assigned to this ride");
    }

    if (ride.status !== "accepted") {
        throw new Error("Ride not accepted");
    }

    if (ride.otp !== otp) {
        throw new Error("Invalid OTP");
    }

    // accepted -> ongoing
    const startedRide = await rideModel
        .findOneAndUpdate(
            { _id: rideId, status: "accepted" },
            { status: "ongoing" },
            { new: true }
        )
        .populate("user")
        .populate("captain");

    if (!startedRide) {
        throw new Error("Ride state changed, please refresh");
    }

    return startedRide;
};

module.exports.endRide = async({ rideId, captain }) => {
    if (!rideId) {
        throw new Error("Ride id is required");
    }

    const ride = await rideModel.findOne({
            _id: rideId,
            ...(captain ? { captain: captain._id } : {})
        })
        .populate("user")
        .populate("captain")
        .select("+otp");

    if (!ride) {
        throw new Error("Ride not found");
    }

    if (ride.status !== "ongoing") {
        throw new Error("Ride not ongoing");
    }

    const completedRide = await rideModel.findOneAndUpdate({
            _id: rideId,
        }, {
            status: "completed",
        }, {
            new: true,
        })
        .populate("user")
        .populate("captain")
        .select("+otp");

    return completedRide;


};