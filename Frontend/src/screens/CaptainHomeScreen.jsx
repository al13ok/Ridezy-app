import { useContext, useEffect, useState } from "react";
import map from "/map.png";
import axios from "axios";
import { useCaptain } from "../contexts/CaptainContext";
import { CheckCircle2, Gauge, LocateFixed, Phone, User, Wallet, XCircle } from "lucide-react";
import { Avatar, IconButton, NumberPlate, vehicleImage } from "../components/ui";
import { SocketDataContext } from "../contexts/SocketContext";
import { NewRide, Sidebar } from "../components";
import Console from "../utils/console";
import { getErrorMessage } from "../utils/errorMessage";
import { useAlert } from "../hooks/useAlert";
import { Alert } from "../components";

const defaultRideData = {
  user: {
    fullname: {
      firstname: "No",
      lastname: "User",
    },
    _id: "",
    email: "example@gmail.com",
    rides: [],
  },
  pickup: "Place, City, State, Country",
  destination: "Place, City, State, Country",
  fare: 0,
  vehicle: "car",
  status: "pending",
  duration: 0,
  distance: 0,
  _id: "123456789012345678901234",
};

function CaptainHomeScreen() {
  const token = localStorage.getItem("token");

  const { captain } = useCaptain();
  const { socket } = useContext(SocketDataContext);
  const [loading, setLoading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();

  const [riderLocation, setRiderLocation] = useState({
    ltd: null,
    lng: null,
  });
  const [mapLocation, setMapLocation] = useState(
    `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng}&output=embed`
  );
  const [earnings, setEarnings] = useState({
    total: 0,
    today: 0,
  });

  const [rides, setRides] = useState({
    accepted: 0,
    cancelled: 0,
    distanceTravelled: 0,
  });
  const [newRide, setNewRide] = useState(
    JSON.parse(localStorage.getItem("rideDetails")) || defaultRideData
  );

  const [otp, setOtp] = useState("");
  const [messages, setMessages] = useState(
    JSON.parse(localStorage.getItem("messages")) || []
  );
  const [error, setError] = useState("");

  // Panels
  const [showCaptainDetailsPanel, setShowCaptainDetailsPanel] = useState(true);
  const [showNewRidePanel, setShowNewRidePanel] = useState(
    JSON.parse(localStorage.getItem("showPanel")) || false
  );
  const [showBtn, setShowBtn] = useState(
    JSON.parse(localStorage.getItem("showBtn")) || "accept"
  );

  const acceptRide = async () => {
    try {
      if (newRide._id != "") {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/confirm`,
          { rideId: newRide._id },
          {
            headers: {
              token: token,
            },
          }
        );
        setLoading(false);
        setShowBtn("otp");
        // Now that we are the assigned captain, we're allowed into the ride's chat room.
        socket.emit("join-room", { rideId: newRide._id, token });
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng} to ${newRide.pickup}&output=embed`
        );
        Console.log(response);
      }
    } catch (error) {
      setLoading(false);
      showAlert('Some error occured', getErrorMessage(error), 'failure');
      Console.log(error.response);
      setTimeout(() => {
        clearRideData();
      }, 1000);
    }
  };

  const verifyOTP = async () => {
    try {
      if (newRide._id != "" && otp.length == 6) {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/ride/start-ride?rideId=${newRide._id}&otp=${otp}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng} to ${newRide.destination}&output=embed`
        );
        setShowBtn("end-ride");
        setLoading(false);
        Console.log(response);
      }
    } catch (err) {
      setLoading(false);
      setError("Invalid OTP");
      Console.log(err);
    }
  };

  const endRide = async () => {
    try {
      if (newRide._id != "") {
        setLoading(true);
        await axios.post(
          `${import.meta.env.VITE_SERVER_URL}/ride/end-ride`,
          {
            rideId: newRide._id,
          },
          {
            headers: {
              token: token,
            },
          }
        );
        setMapLocation(
          `https://www.google.com/maps?q=${riderLocation.ltd},${riderLocation.lng}&output=embed`
        );
        setShowBtn("accept");
        setLoading(false);
        setShowCaptainDetailsPanel(true);
        setShowNewRidePanel(false);
        setNewRide(defaultRideData);
        localStorage.removeItem("rideDetails");
        localStorage.removeItem("showPanel");
      }
    } catch (err) {
      setLoading(false);
      Console.log(err);
    }
  };

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Console.log(position);
          setRiderLocation({
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          });

          setMapLocation(
            `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}&output=embed`
          );
          // Captain identity comes from the socket's verified "join", not from the payload.
          socket.emit("update-location-captain", {
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
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

  const clearRideData = () => {
    setShowBtn("accept");
    setLoading(false);
    setShowCaptainDetailsPanel(true);
    setShowNewRidePanel(false);
    setNewRide(defaultRideData);
    localStorage.removeItem("rideDetails");
    localStorage.removeItem("showPanel");
  }

  useEffect(() => {
    if (captain._id) {
      socket.emit("join", { token });

      // const locationInterval = setInterval(updateLocation, 10000);
      updateLocation(); // IMP: Call this function to update location
    }

    socket.on("new-ride", (data) => {
      Console.log("New Ride available:", data);
      setShowBtn("accept");
      setNewRide(data);
      setShowNewRidePanel(true);
    });

    socket.on("ride-cancelled", (data) => {
      Console.log("Ride cancelled", data);
      updateLocation();
      clearRideData();
    });
  }, [captain]);

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    // Server only lets the ride's assigned captain into the room, so this succeeds
    // for an accepted ride (e.g. after a page refresh). Right after accepting,
    // acceptRide() joins the room again.
    if (newRide._id) {
      socket.emit("join-room", { rideId: newRide._id, token });
    }

    socket.on("receiveMessage", async (msg) => {
      // Console.log("Received message: ", msg);
      setMessages((prev) => [...prev, { msg, by: "other" }]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("rideDetails", JSON.stringify(newRide));
  }, [newRide]);

  useEffect(() => {
    localStorage.setItem("showPanel", JSON.stringify(showNewRidePanel));
    localStorage.setItem("showBtn", JSON.stringify(showBtn));
  }, [showNewRidePanel, showBtn]);

  const calculateEarnings = () => {
    let Totalearnings = 0;
    let Todaysearning = 0;

    let acceptedRides = 0;
    let cancelledRides = 0;

    let distanceTravelled = 0;

    const today = new Date();
    const todayWithoutTime = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    captain.rides.forEach((ride) => {
      if (ride.status == "completed") {
        acceptedRides++;
        distanceTravelled += ride.distance;
      }
      if (ride.status == "cancelled") cancelledRides++;

      Totalearnings += ride.fare;
      const rideDate = new Date(ride.updatedAt);

      const rideDateWithoutTime = new Date(
        rideDate.getFullYear(),
        rideDate.getMonth(),
        rideDate.getDate()
      );

      if (
        rideDateWithoutTime.getTime() === todayWithoutTime.getTime() &&
        ride.status === "completed"
      ) {
        Todaysearning += ride.fare;
      }
    });

    setEarnings({ total: Totalearnings, today: Todaysearning });
    setRides({
      accepted: acceptedRides,
      cancelled: cancelledRides,
      distanceTravelled: Math.round(distanceTravelled / 1000),
    });
  };

  useEffect(() => {
    calculateEarnings();
  }, [captain]);

  useEffect(() => {
    if (mapLocation.ltd && mapLocation.lng) {
      Console.log(mapLocation);
    }
  }, [mapLocation]);

  useEffect(() => {
    if (socket.id) Console.log("socket id:", socket.id);
  }, [socket.id]);

  return (
    <div
      className="relative w-full h-dvh overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${map})` }}
    >
      <Alert
        heading={alert.heading}
        text={alert.text}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
      />
      <Sidebar />
      <iframe
        src={mapLocation}
        className="absolute inset-x-0 top-0 map w-full h-[80vh]"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/70 to-transparent" />

      {/* Online indicator + re-center */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <span className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-ink-900 shadow-float">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
          </span>
          Online
        </span>
        <IconButton onClick={updateLocation} label="Update my location">
          <LocateFixed size={19} />
        </IconButton>
      </div>

      {showCaptainDetailsPanel && (
        <div className="sheet animate-slide-up">
          <div className="sheet-handle" />

          {/* Captain */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar firstname={captain?.fullname?.firstname} lastname={captain?.fullname?.lastname} tone="ink" />
              <div className="min-w-0">
                <p className="truncate text-[17px] font-extrabold tracking-tight">
                  {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                </p>
                <p className="flex items-center gap-1 text-xs text-ink-500">
                  <Phone size={12} />
                  {captain?.phone}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-ink-100 px-3 py-1 text-[11px] font-semibold text-ink-600">
              Waiting for rides
            </span>
          </div>

          {/* Earnings */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-brand-900 p-5 text-white">
            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-500/20 blur-2xl" />
            <div className="relative flex items-end justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium text-white/60">
                  <Wallet size={14} /> Today&apos;s earnings
                </p>
                <p className="mt-1 text-4xl font-extrabold tracking-tight">₹{earnings.today}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-white/50">All time</p>
                <p className="text-lg font-bold">₹{earnings.total}</p>
              </div>
            </div>
            <div className="relative mt-5 grid grid-cols-3 gap-2">
              {[
                { value: rides?.accepted, label: "Completed", icon: CheckCircle2 },
                { value: `${rides?.distanceTravelled}`, label: "Km driven", icon: Gauge },
                { value: rides?.cancelled, label: "Cancelled", icon: XCircle },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label} className="rounded-2xl bg-white/[0.07] px-3 py-2.5 ring-1 ring-white/10">
                  <Icon size={14} className="mb-1 text-brand-300" />
                  <p className="text-lg font-bold leading-tight">{value}</p>
                  <p className="text-[11px] text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle */}
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-ink-50 py-2 pl-4 pr-2 ring-1 ring-ink-200/70">
            <div>
              <p className="eyebrow mb-1">Your vehicle</p>
              <NumberPlate number={captain?.vehicle?.number} />
              <p className="mt-1.5 flex items-center gap-1 text-xs capitalize text-ink-500">
                {captain?.vehicle?.color} {captain?.vehicle?.type} ·
                <User size={12} strokeWidth={2.5} /> {captain?.vehicle?.capacity} seats
              </p>
            </div>
            <img
              className="h-16 w-24 scale-x-[-1] object-contain mix-blend-multiply"
              src={vehicleImage(captain?.vehicle?.type)}
              alt="Vehicle"
            />
          </div>
        </div>
      )}

      <NewRide
        rideData={newRide}
        otp={otp}
        setOtp={setOtp}
        showBtn={showBtn}
        showPanel={showNewRidePanel}
        setShowPanel={setShowNewRidePanel}
        showPreviousPanel={setShowCaptainDetailsPanel}
        loading={loading}
        acceptRide={acceptRide}
        verifyOTP={verifyOTP}
        endRide={endRide}
        error={error}
      />
    </div>
  );
}

export default CaptainHomeScreen;
