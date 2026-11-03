import { Banknote, MessageCircle, PhoneCall, Route, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { Avatar, Divider, RouteTimeline } from "./ui";

// Captain's ride panel. Props are unchanged; showBtn drives the state:
// "accept" -> incoming request, "otp" -> waiting for rider PIN, otherwise -> trip in progress.
function NewRide({
  rideData,
  otp,
  setOtp,
  showBtn,
  showPanel,
  setShowPanel,
  showPreviousPanel,
  loading,
  acceptRide,
  endRide,
  verifyOTP,
  error,
}) {
  const ignoreRide = () => {
    setShowPanel(false);
    showPreviousPanel(true);
  };

  const rider = rideData?.user;
  const distanceKm = (Number(rideData?.distance || 0) / 1000).toFixed(1);

  return (
    <div
      className={`sheet max-h-[88%] overflow-y-auto transition-transform duration-500 ease-out ${
        showPanel ? "translate-y-0" : "pointer-events-none translate-y-[110%]"
      }`}
    >
      <div className="sheet-handle" />

      {/* State label */}
      <div className="mb-4 flex items-center justify-between">
        {showBtn == "accept" ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
            </span>
            New ride request
          </span>
        ) : showBtn == "otp" ? (
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">Heading to pickup</span>
        ) : (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">Trip in progress</span>
        )}
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink-500">
          <Route size={14} /> {distanceKm} km
        </span>
      </div>

      {/* Rider + fare */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar firstname={rider?.fullname?.firstname} lastname={rider?.fullname?.lastname} tone="blue" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-bold tracking-tight">
              {rider?.fullname?.firstname} {rider?.fullname?.lastname}
            </p>
            <p className="truncate text-xs text-ink-500">{rider?.phone || rider?.email}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="eyebrow">Fare</p>
          <p className="text-2xl font-extrabold tracking-tight">₹{rideData?.fare}</p>
        </div>
      </div>

      {/* Message and call */}
      {showBtn != "accept" && (
        <div className="mb-4 flex gap-2">
          <Link
            to={`/captain/chat/${rideData?._id}`}
            className="flex h-11 flex-1 items-center gap-2 rounded-xl bg-ink-100 px-4 text-sm font-medium text-ink-500 transition hover:bg-ink-200"
          >
            <MessageCircle size={17} className="text-ink-900" /> Message rider…
          </Link>
          <a
            href={"tel:" + rider?.phone}
            aria-label="Call rider"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand transition hover:bg-brand-600"
          >
            <PhoneCall size={17} />
          </a>
        </div>
      )}

      {/* Route + payment */}
      <div className="card mb-4 p-4">
        <RouteTimeline pickup={rideData?.pickup} destination={rideData?.destination} />
        <Divider className="my-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-700">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Banknote size={17} />
            </span>
            Collect cash
          </div>
          <p className="text-base font-extrabold tracking-tight">₹{rideData?.fare}</p>
        </div>
      </div>

      {/* Actions */}
      {showBtn == "accept" ? (
        <div className="flex gap-2">
          <Button title={"Ignore"} loading={loading} fun={ignoreRide} variant="outline" />
          <Button title={"Accept ride"} fun={acceptRide} loading={loading} variant="brand" />
        </div>
      ) : showBtn == "otp" ? (
        <>
          <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink-700">
            <ShieldCheck size={15} className="text-brand-600" /> Enter the rider&apos;s 6-digit PIN
          </label>
          <input
            type="number"
            inputMode="numeric"
            minLength={6}
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder={"• • • • • •"}
            className="field mb-2 h-14 text-center text-2xl font-extrabold tracking-[0.5em] placeholder:tracking-[0.3em]"
          />
          {error && <p className="mb-2 text-center text-xs font-medium text-red-500">{error}</p>}
          <Button title={"Verify & start trip"} loading={loading} fun={verifyOTP} variant="primary" size="lg" />
        </>
      ) : (
        <Button title={"Complete trip"} fun={endRide} loading={loading} variant="brand" size="lg" />
      )}
    </div>
  );
}

export default NewRide;
