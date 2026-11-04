import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useUser } from "../contexts/UserContext";
import map from "/map.png";
import {
  Button,
  LocationSuggestions,
  SelectVehicle,
  RideDetails,
  Sidebar,
} from "../components";
import axios from "axios";
import debounce from "lodash.debounce";
import { ArrowRight, LocateFixed } from "lucide-react";
import { IconButton } from "../components/ui";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";

function UserHomeScreen() {
  const token = localStorage.getItem("token"); // this token is in use
  const { socket } = useContext(SocketDataContext);
  const { user } = useUser();
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [loading, setLoading] = useState(false);
  const [selectedInput, setSelectedInput] = useState("pickup");
  const [locationSuggestion, setLocationSuggestion] = useState([]);
  const [mapLocation, setMapLocation] = useState("");
  const [rideCreated, setRideCreated] = useState(false);




  // Ride details
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [fare, setFare] = useState({
    auto: 0,
    car: 0,
    bike: 0,
  });
  const [confirmedRideData, setConfirmedRideData] = useState(null);
  const rideTimeout = useRef(null);

  // Panels
  const [showFindTripPanel, setShowFindTripPanel] = useState(true);
  const [showSelectVehiclePanel, setShowSelectVehiclePanel] = useState(false);
  const [showRideDetailsPanel, setShowRideDetailsPanel] = useState(false);

  const handleLocationChange = useCallback(
    debounce(async (inputValue, token) => {
      if (inputValue.length >= 3) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVER_URL
            }/map/get-suggestions?input=${inputValue}`,
            {
              headers: {
                token: token,
              },
            }
          );
          Console.log(response.data);
          setLocationSuggestion(response.data);
        } catch (error) {
          Console.error(error);
        }
      }
    }, 700),
    []
  );
const mockLocations = [
  "Indira Colony",
  "Kashmere Gate",
  "Connaught Place",
  "Rajiv Chowk",
  "Saket",
  "Noida Sector 18",
  "IGI Airport",
  "Gurgaon Cyber Hub",
  "Chandigarh University",
  "Elante Mall",
];
  const onChangeHandler = (e) => {
    setSelectedInput(e.target.id);
    const value = e.target.value;
    if (e.target.id == "pickup") {
      setPickupLocation(value);
    } else if (e.target.id == "destination") {
      setDestinationLocation(value);
    }


     const filteredLocations = mockLocations.filter((location) =>
  location.toLowerCase().includes(value.toLowerCase())
);

setLocationSuggestion(filteredLocations);
    

    if (e.target.value.length < 3) {
      setLocationSuggestion([]);
    }
  };

  const getDistanceAndFare = async (pickupLocation, destinationLocation) => {
    Console.log(pickupLocation, destinationLocation);
    try {
      setLoading(true);
      setMapLocation(
        `https://www.google.com/maps?q=${pickupLocation} to ${destinationLocation}&output=embed`
      );
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL
        }/ride/get-fare?pickup=${pickupLocation}&destination=${destinationLocation}`,
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      setFare(response.data.fare);

      setShowFindTripPanel(false);
      setShowSelectVehiclePanel(true);
      setLocationSuggestion([]);
      setLoading(false);
    } catch (error) {
      Console.log(error);
      setLoading(false);
    }
  };

  const createRide = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ride/create`,
        {
          pickup: pickupLocation,
          destination: destinationLocation,
          vehicleType: selectedVehicle,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log(response);
      const rideData = {
        pickup: pickupLocation,
        destination: destinationLocation,
        vehicleType: selectedVehicle,
        fare: fare,
        confirmedRideData: confirmedRideData,
        _id: response.data._id,
      };
      localStorage.setItem("rideDetails", JSON.stringify(rideData));
      setLoading(false);
      setRideCreated(true);

      // Automatically cancel the ride after 1.5 minutes
      rideTimeout.current = setTimeout(() => {
        cancelRide();
      }, import.meta.env.VITE_RIDE_TIMEOUT);
      
    } catch (error) {
      Console.log(error);
      setLoading(false);
    }
  };

  const cancelRide = async () => {
    Console.log("CANCEL RIDE CALLED");
    // clear auto cancel timer
    clearTimeout(rideTimeout.current);
    const rideDetails = JSON.parse(localStorage.getItem("rideDetails"));
    try {
      setLoading(true);
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/cancel?rideId=${rideDetails._id || rideDetails.confirmedRideData._id
        }`,
        {
          headers: {
            token: token,
          },
        }
      );
      setLoading(false);
      updateLocation();
      setShowRideDetailsPanel(false);
      setShowSelectVehiclePanel(false);
      setShowFindTripPanel(true);
      setDefaults();
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
      localStorage.removeItem("messages");
      localStorage.removeItem("showPanel");
      localStorage.removeItem("showBtn");
    } catch (error) {
      Console.log(error);
      setLoading(false);
    }
  };
  // Set ride details to default values
  const setDefaults = () => {
    Console.log("SET DEFAULTS CALLED");
    setPickupLocation("");
    setDestinationLocation("");
    setSelectedVehicle("car");
    setFare({
      auto: 0,
      car: 0,
      bike: 0,
    });
    setConfirmedRideData(null);
    setRideCreated(false);
  };

  const startRide = async (otp) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/start-ride?rideId=${confirmedRideData._id}&otp=${otp}`,
        {
          headers: {
            token: token,
          },
        }
      );
      setConfirmedRideData(response.data);
      setLoading(false);
    } catch (error) {
      Console.log(error);
      setLoading(false);
    }
  };

  const endRide = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/ride/end-ride`,
        {
          rideId: confirmedRideData._id,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      Console.log("END RIDE RESPONSE");
    Console.log(response.data);
      setConfirmedRideData(response.data);
      setLoading(false);
    } catch (error) {
      Console.log(error);
      setLoading(false);
    }
  };

  const handleDone = () => {
    Console.log("HANDLE DONE CALLED");
    updateLocation();
    setShowRideDetailsPanel(false);
    setShowSelectVehiclePanel(false);
    setShowFindTripPanel(true);
    setDefaults();
    localStorage.removeItem("rideDetails");
    localStorage.removeItem("panelDetails");
    localStorage.removeItem("messages");
    localStorage.removeItem("showPanel");
    localStorage.removeItem("showBtn");
  };

  // Update Location
  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapLocation(
            `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}&output=embed`
          );
        },
        (error) => {
          console.error("Error fetching position:", error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              console.error("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              console.error("The request to get user location timed out.");
              break;
            default:
              console.error("An unknown error occurred.");
          }
        }
      );
    }
  };

  // Update Location
  useEffect(() => {
    updateLocation();
  }, []);

  // Socket Events
  useEffect(() => {
    if (user._id) {
      socket.emit("join", { token });
    }

    socket.on("ride-confirmed", (data) => {
      Console.log("Clearing Timeout", rideTimeout);
      clearTimeout(rideTimeout.current);
      Console.log("Cleared Timeout");
      Console.log("Ride Confirmed");
      Console.log(data.captain.location);
      setMapLocation(
        `https://www.google.com/maps?q=${data.captain.location.coordinates[1]},${data.captain.location.coordinates[0]} to ${pickupLocation}&output=embed`
      );
      setConfirmedRideData(data);
    });

    socket.on("ride-started", (data) => {
  Console.log("Ride started", data);
  Console.log("STATUS =", data.status);

  setMapLocation(
    `https://www.google.com/maps?q=${data.pickup} to ${data.destination}&output=embed`
  );

  setConfirmedRideData(data);
});

     socket.on("ride-ended", (data) => {
  Console.log("Ride ended", data);
  setConfirmedRideData(data);

  localStorage.setItem(
    "rideDetails",
    JSON.stringify({
      pickup: pickupLocation,
      destination: destinationLocation,
      vehicleType: selectedVehicle,
      fare,
      confirmedRideData: data,
    })
  );
});
  return () => {
    socket.off("ride-confirmed");
    socket.off("ride-started");
    socket.off("ride-ended");
  };
},[user]);

  // Get ride details
  useEffect(() => {
    const storedRideDetails = localStorage.getItem("rideDetails");
    const storedPanelDetails = localStorage.getItem("panelDetails");

    if (storedRideDetails) {
      const ride = JSON.parse(storedRideDetails);
      setPickupLocation(ride.pickup);
      setDestinationLocation(ride.destination);
      setSelectedVehicle(ride.vehicleType);
      setFare(ride.fare);
      setConfirmedRideData(ride.confirmedRideData);
    }

    if (storedPanelDetails) {
      const panels = JSON.parse(storedPanelDetails);
      setShowFindTripPanel(panels.showFindTripPanel);
      setShowSelectVehiclePanel(panels.showSelectVehiclePanel);
      setShowRideDetailsPanel(panels.showRideDetailsPanel);
    }
   }, []);

  // Store Ride Details
  useEffect(() => {
    const rideData = {
      pickup: pickupLocation,
      destination: destinationLocation,
      vehicleType: selectedVehicle,
      fare: fare,
      confirmedRideData: confirmedRideData,
    };
    localStorage.setItem("rideDetails", JSON.stringify(rideData));
  }, [
    pickupLocation,
    destinationLocation,
    selectedVehicle,
    fare,
    confirmedRideData,
  ]);

  // Store panel information
  useEffect(() => {
    const panelDetails = {
      showFindTripPanel,
      showSelectVehiclePanel,
      showRideDetailsPanel,
    };
    localStorage.setItem("panelDetails", JSON.stringify(panelDetails));
  }, [showFindTripPanel, showSelectVehiclePanel, showRideDetailsPanel]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (confirmedRideData?._id) {
    socket.emit("join-room", { rideId: confirmedRideData._id, token });
  }

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, { msg, by: "other" }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [confirmedRideData]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div
      className="relative w-full h-dvh overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${map})` }}
    >
      <Sidebar />
      <iframe
        src={mapLocation}
        className="absolute inset-x-0 top-0 map w-full h-[120vh]"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 to-transparent" />

      {/* recenter */}
      <IconButton onClick={updateLocation} label="Use my location" className="absolute right-4 top-4 z-10">
        <LocateFixed size={19} />
      </IconButton>

      {/* pickup / drop sheet */}
      {showFindTripPanel && (
        <div className="sheet max-h-[85%] overflow-y-auto animate-slide-up">
          <div className="sheet-handle" />
          <p className="text-sm font-medium text-ink-500">
            {greeting}
            {user?.fullname?.firstname ? `, ${user.fullname.firstname}` : ""} 👋
          </p>
          <h1 className="mb-4 text-[26px] font-extrabold leading-tight tracking-tight">Where to?</h1>

          <div className="relative rounded-2xl bg-ink-50 p-2 ring-1 ring-ink-200/70">
            {/* timeline dots */}
            <div className="pointer-events-none absolute bottom-[30px] left-[26px] top-[30px] w-0.5 bg-gradient-to-b from-brand-500 to-ink-900" />
            <div className="relative flex items-center">
              <span className="absolute left-[19px] z-[1] h-4 w-4 rounded-full border-[4px] border-brand-500 bg-white" />
              <input
                id="pickup"
                placeholder="Pickup location"
                className="h-12 w-full truncate rounded-xl bg-transparent pl-12 pr-3 text-sm font-semibold text-ink-900 outline-none transition placeholder:font-medium placeholder:text-ink-400 focus:bg-white focus:shadow-soft"
                value={pickupLocation}
                onChange={onChangeHandler}
                autoComplete="off"
                onFocus={() => {
                  setSelectedInput("pickup");
                  setLocationSuggestion([
                    "Indira Colony",
                    "Kashmere Gate",
                    "Connaught Place",
                    "Rajiv Chowk",
                    "Saket",
                  ]);
                }}
              />
            </div>
            <div className="mx-3 ml-12 h-px bg-ink-200" />
            <div className="relative flex items-center">
              <span className="absolute left-[19px] z-[1] h-4 w-4 rounded-[5px] border-[4px] border-ink-900 bg-white" />
              <input
                id="destination"
                placeholder="Where are you going?"
                className="h-12 w-full truncate rounded-xl bg-transparent pl-12 pr-3 text-sm font-semibold text-ink-900 outline-none transition placeholder:font-medium placeholder:text-ink-400 focus:bg-white focus:shadow-soft"
                value={destinationLocation}
                onChange={onChangeHandler}
                autoComplete="off"
                onFocus={() => {
                  setSelectedInput("destination");
                  setLocationSuggestion([
                    "Noida Sector 18",
                    "IGI Airport",
                    "Gurgaon Cyber Hub",
                    "Chandigarh University",
                    "Elante Mall",
                  ]);
                }}
              />
            </div>
          </div>

          {pickupLocation.length > 2 && destinationLocation.length > 2 && (
            <div className="mt-4 animate-fade-in">
              <Button
                title={"See prices"}
                icon={<ArrowRight size={18} />}
                variant="brand"
                size="lg"
                loading={loading}
                fun={() => {
                  getDistanceAndFare(pickupLocation, destinationLocation);
                }}
              />
            </div>
          )}

          {locationSuggestion.length > 0 && (
            <div className="mt-3">
              <LocationSuggestions
                suggestions={locationSuggestion}
                setSuggestions={setLocationSuggestion}
                setPickupLocation={setPickupLocation}
                setDestinationLocation={setDestinationLocation}
                input={selectedInput}
              />
            </div>
          )}
        </div>
      )}

      {/* Select Vehicle Panel */}
      <SelectVehicle
        selectedVehicle={setSelectedVehicle}
        showPanel={showSelectVehiclePanel}
        setShowPanel={setShowSelectVehiclePanel}
        showPreviousPanel={setShowFindTripPanel}
        showNextPanel={setShowRideDetailsPanel}
        fare={fare}
      />

      {/* Ride Details Panel */}
      <RideDetails
        pickupLocation={pickupLocation}
        destinationLocation={destinationLocation}
        selectedVehicle={selectedVehicle}
        fare={fare}
        showPanel={showRideDetailsPanel}
        setShowPanel={setShowRideDetailsPanel}
        showPreviousPanel={setShowSelectVehiclePanel}
        createRide={createRide}
        cancelRide={cancelRide}
        loading={loading}
        rideCreated={rideCreated}
        confirmedRideData={confirmedRideData}
        startRide={startRide}
        endRide={endRide}
        handleDone={handleDone}
      />
    </div>
  );
}

export default UserHomeScreen;
