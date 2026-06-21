const axios = require("axios");
const captainModel = require("../models/captain.model");

// module.exports.getAddressCoordinate = async(address) => {
//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//     address
//   )}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.status === "OK") {
//             const location = response.data.results[0].geometry.location;
//             return {
//                 ltd: location.lat,
//                 lng: location.lng,
//             };
//         } else {
//             throw new Error("Unable to fetch coordinates");
//         }
//     } catch (error) {
//         console.error(error);
//         throw error;
//     }
// };

// module.exports.getDistanceTime = async (origin, destination) => {
//   if (!origin || !destination) {
//     throw new Error("Origin and destination are required");
//   }
//   const apiKey = process.env.GOOGLE_MAPS_API;

//   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
//     origin
//   )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     if (response.data.status === "OK") {
//       if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
//         throw new Error("No routes found");
//       }

//       return response.data.rows[0].elements[0];
//     } else {
//       throw new Error("Unable to fetch distance and time");
//     }
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

module.exports.getAddressCoordinate = async(address) => {
    return {
        ltd: 28.6139,
        lng: 77.2090,
    };
};
module.exports.getDistanceTime = async(origin, destination) => {
    if (!origin || !destination) {
        throw new Error("Origin and destination are required");
    }

    // deterministic mock route
    const routes = {
        "indira colony-kashmere gate": {
            distance: 36.6,
            duration: 81,
        },

        "connaught place-noida sector 18": {
            distance: 18.4,
            duration: 42,
        },

        "gurgaon cyber hub-igi airport": {
            distance: 14.2,
            duration: 28,
        },

        "rajiv chowk-saket": {
            distance: 17.5,
            duration: 39,
        },
    };

    const key =
        `${origin}-${destination}`.toLowerCase().trim();

    let distanceKm;
    let durationMin;

    if (routes[key]) {
        distanceKm = routes[key].distance;
        durationMin = routes[key].duration;
    } else {
        distanceKm = Math.floor(Math.random() * 30) + 5;
        durationMin = Math.floor(distanceKm * 2.2);
    }

    return {
        distance: {
            text: `${distanceKm} km`,
            value: distanceKm * 1000,
        },

        duration: {
            text: `${durationMin} mins`,
            value: durationMin * 60,
        },

        status: "OK",
    };
};

// module.exports.getAutoCompleteSuggestions = async(input) => {
//     if (!input) {
//         throw new Error("query is required");
//     }

//     const apiKey = process.env.GOOGLE_MAPS_API;
//     const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
//     input
//   )}&key=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         if (response.data.status === "OK") {
//             return response.data.predictions
//                 .map((prediction) => prediction.description)
//                 .filter((value) => value);
//         } else {
//             throw new Error("Unable to fetch suggestions");
//         }
//     } catch (err) {
//         console.log(err.message);
//         throw err;
//     }
// };
module.exports.getAutoCompleteSuggestions = async(input) => {
    const places = [
        "Indira Colony",
        "Kashmere Gate",
        "Connaught Place",
        "Rajiv Chowk",
        "Saket",
        "Noida Sector 18",
        "Gurgaon Cyber Hub",
        "IGI Airport",
        "Chandigarh University",
        "Elante Mall",
    ];

    return places.filter((place) =>
        place.toLowerCase().includes(input.toLowerCase())
    );
};

module.exports.getCaptainsInTheRadius = async(ltd, lng, radius, vehicleType) => {
    // radius in km

    try {
        const captains = await captainModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [lng, ltd], radius / 6371
                    ],
                },
            },
            "vehicle.type": vehicleType,
        });
        return captains;
    } catch (error) {
        throw new Error("Error in getting captain in radius: " + error.message);
    }
};