import { ArrowLeft, Banknote, CheckCircle2, MessageCircle, PhoneCall, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { Avatar, Divider, NumberPlate, RouteTimeline, StatusPill, vehicleImage, vehicleMeta } from "./ui";

// Rider's ride panel. Props are unchanged from the original component; only the UI is new.
function RideDetails({
  pickupLocation,
  destinationLocation,
  selectedVehicle,
  fare,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  createRide,
  cancelRide,
  loading,
  rideCreated,
  confirmedRideData,
  endRide,
  handleDone,
}) {
  const status = confirmedRideData?.status;
  const isSearching = rideCreated && !confirmedRideData;
  const isCompleted = status === "completed";
  const captain = confirmedRideData?.captain;
  const vehicle = vehicleMeta[selectedVehicle] || vehicleMeta.car;
  const amount = confirmedRideData?.fare || fare?.[selectedVehicle] || 0;

  return (
    <div
      className={`sheet max-h-[88%] overflow-y-auto transition-transform duration-500 ease-out ${
        showPanel ? "translate-y-0" : "pointer-events-none translate-y-[110%]"
      }`}
    >
      <div className="sheet-handle" />

      {/* ---------- Header per state ---------- */}
      {!confirmedRideData && !isSearching && (
        <div className="mb-4 flex items-center gap-3">
          <button
            type="button"
            aria-label="Back"
            onClick={() => {
              setShowPanel(false);
              showPreviousPanel(true);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-900 transition active:scale-95"
          >
            <ArrowLeft size={19} strokeWidth={2.4} />
          </button>
          <div>
            <h2 className="text-xl font-extrabold tracking-tight">Confirm your ride</h2>
            <p className="text-xs text-ink-500">Review the trip before booking</p>
          </div>
        </div>
      )}

      {isSearching && (
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="relative my-3 flex h-28 w-28 items-center justify-center">
            <span className="absolute inset-0 animate-radar rounded-full bg-brand-400/40" />
            <span className="absolute inset-0 animate-radar rounded-full bg-brand-400/30 [animation-delay:0.8s]" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-float">
              <img src={vehicleImage(selectedVehicle)} alt="" className="h-12 object-contain" />
            </div>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Finding your captain</h2>
          <p className="mt-1 text-sm text-ink-500">Matching you with a nearby {vehicle.label.toLowerCase()} driver…</p>
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-ink-100">
            <div className="h-full w-2/5 animate-progress rounded-full bg-brand-500" />
          </div>
        </div>
      )}

      {isCompleted && (
        <div className="mb-5 flex animate-pop-in flex-col items-center pt-2 text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <CheckCircle2 size={36} strokeWidth={2.2} />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">You&apos;ve arrived!</h2>
          <p className="mt-1 text-sm text-ink-500">Thanks for riding with Ridezy</p>
          <p className="mt-4 text-4xl font-extrabold tracking-tight">₹{amount}</p>
          <p className="text-xs text-ink-400">Pay your captain in cash</p>
        </div>
      )}

      {/* ---------- Captain card (after a captain accepts) ---------- */}
      {confirmedRideData?._id && !isCompleted && (
        <div className="mb-4">
          <div className="mb-3 flex items-center justify-between">
            <StatusPill status={status} />
            <span className="text-xs font-medium text-ink-400">
              {status === "accepted" ? "Your captain is on the way" : "Enjoy your ride"}
            </span>
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar
                  firstname={captain?.fullname?.firstname}
                  lastname={captain?.fullname?.lastname}
                  tone="ink"
                />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold tracking-tight">
                    {captain?.fullname?.firstname} {captain?.fullname?.lastname}
                  </p>
                  <p className="truncate text-xs capitalize text-ink-500">
                    {captain?.vehicle?.color} {captain?.vehicle?.type}
                  </p>
                  <div className="mt-1">
                    <NumberPlate number={captain?.vehicle?.number} />
                  </div>
                </div>
              </div>
              <img src={vehicleImage(captain?.vehicle?.type || selectedVehicle)} alt="" className="h-16 w-20 object-contain" />
            </div>

            {status === "accepted" && confirmedRideData?.otp && (
              <div className="mt-4 rounded-2xl bg-ink-900 p-4 text-white">
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <ShieldCheck size={14} /> Share this PIN with your captain to start
                </div>
                <div className="mt-2 flex gap-1.5">
                  {String(confirmedRideData.otp)
                    .split("")
                    .map((digit, i) => (
                      <span
                        key={i}
                        className="flex h-11 flex-1 items-center justify-center rounded-xl bg-white/10 text-xl font-extrabold"
                      >
                        {digit}
                      </span>
                    ))}
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <Link
                to={`/user/chat/${confirmedRideData?._id}`}
                className="flex h-11 flex-1 items-center gap-2 rounded-xl bg-ink-100 px-4 text-sm font-medium text-ink-500 transition hover:bg-ink-200"
              >
                <MessageCircle size={17} className="text-ink-900" /> Message your captain…
              </Link>
              <a
                href={"tel:" + captain?.phone}
                aria-label="Call captain"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand transition hover:bg-brand-600"
              >
                <PhoneCall size={17} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Pre-booking vehicle summary ---------- */}
      {!confirmedRideData && !isSearching && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-ink-50 p-3">
          <div className="flex h-14 w-16 items-center justify-center rounded-xl bg-white">
            <img src={vehicle.image} alt="" className="h-10 object-contain mix-blend-multiply" />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-bold tracking-tight">{vehicle.name}</p>
            <p className="text-xs text-ink-500">Up to {vehicle.seats} seat{vehicle.seats > 1 ? "s" : ""}</p>
          </div>
          <p className="text-lg font-extrabold tracking-tight">₹{amount}</p>
        </div>
      )}

      {/* ---------- Route + payment ---------- */}
      <div className="card mb-4 p-4">
        <RouteTimeline pickup={pickupLocation} destination={destinationLocation} />
        <Divider className="my-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Banknote size={17} />
            </span>
            Cash
          </div>
          <p className="text-base font-extrabold tracking-tight">₹{amount}</p>
        </div>
      </div>

      {/* ---------- Actions ---------- */}
      <div className="space-y-2">
        {!confirmedRideData && !isSearching && (
          <Button title={"Confirm ride"} fun={createRide} loading={loading} variant="brand" size="lg" />
        )}

        {isSearching && <Button title={"Cancel request"} fun={cancelRide} loading={loading} variant="danger" />}

        {status === "ongoing" && <Button title={"End ride"} fun={endRide} loading={loading} variant="brand" size="lg" />}

        {/* Backend only allows cancelling before the trip starts */}
        {status === "accepted" && (
          <Button title={"Cancel ride"} fun={cancelRide} loading={loading} variant="danger" />
        )}

        {isCompleted && <Button title={"Done"} fun={handleDone} variant="primary" size="lg" />}
      </div>
    </div>
  );
}

export default RideDetails;
