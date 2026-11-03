import { useState } from "react";
import { Calendar, ChevronDown, Clock, MapPinned } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageHeader, RouteTimeline, StatusPill, vehicleImage } from "../components/ui";

function RideHistory() {
  const navigation = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [user] = useState(userData.data);
  const isCaptain = userData?.type === "captain";

  function classifyAndSortRides(rides) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // Helper function to check if a date is today
    const isToday = (date) =>
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate();

    // Helper function to check if a date is yesterday
    const isYesterday = (date) =>
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();

    // Helper function to sort rides by date (recent to oldest)
    const sortByDate = (rides) => rides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const todayRides = [];
    const yesterdayRides = [];
    const earlierRides = [];

    rides.forEach((ride) => {
      const createdDate = new Date(ride.createdAt);
      if (isToday(createdDate)) {
        todayRides.push(ride);
      } else if (isYesterday(createdDate)) {
        yesterdayRides.push(ride);
      } else {
        earlierRides.push(ride);
      }
    });

    return {
      today: sortByDate(todayRides),
      yesterday: sortByDate(yesterdayRides),
      earlier: sortByDate(earlierRides),
    };
  }

  const rides = user?.rides || [];
  const grouped = classifyAndSortRides([...rides]);
  const completed = rides.filter((r) => r.status === "completed");
  const totalAmount = completed.reduce((sum, r) => sum + (r.fare || 0), 0);

  const sections = [
    { key: "today", label: "Today" },
    { key: "yesterday", label: "Yesterday" },
    { key: "earlier", label: "Earlier" },
  ];

  return (
    <div className="h-dvh overflow-y-auto bg-ink-100">
      <PageHeader title="Your rides" subtitle={`${rides.length} trip${rides.length === 1 ? "" : "s"}`} onBack={() => navigation(-1)} />

      <div className="px-4 pb-8">
        {/* Summary */}
        <div className="mb-5 grid grid-cols-2 gap-2">
          <div className="rounded-2xl bg-ink-900 p-4 text-white">
            <p className="text-xs text-white/60">Completed trips</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">{completed.length}</p>
          </div>
          <div className="rounded-2xl bg-brand-500 p-4 text-white">
            <p className="text-xs text-white/80">{isCaptain ? "Total earned" : "Total spent"}</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">₹{totalAmount}</p>
          </div>
        </div>

        {rides.length === 0 && (
          <div className="card flex flex-col items-center p-8 text-center">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-400">
              <MapPinned size={26} />
            </span>
            <p className="font-semibold">No rides yet</p>
            <p className="mt-1 text-xs text-ink-500">Your trips will show up here.</p>
          </div>
        )}

        {rides.length > 0 &&
          sections.map(({ key, label }) => (
            <details open className="group mb-4" key={key}>
              <summary className="mb-2 flex cursor-pointer select-none list-none items-center justify-between px-1">
                <span className="text-sm font-bold text-ink-700">
                  {label} <span className="font-medium text-ink-400">· {grouped[key].length}</span>
                </span>
                <ChevronDown size={18} className="text-ink-400 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              {grouped[key].length > 0 ? (
                <div className="space-y-2">
                  {grouped[key].map((ride) => (
                    <Ride ride={ride} key={ride._id} />
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-dashed border-ink-200 py-4 text-center text-xs text-ink-400">
                  No rides {label.toLowerCase()}
                </p>
              )}
            </details>
          ))}
      </div>
    </div>
  );
}

export const Ride = ({ ride }) => {
  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  }

  function formatTime(inputDate) {
    const date = new Date(inputDate);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${period}`;
  }

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-12 items-center justify-center rounded-xl bg-ink-50">
            <img src={vehicleImage(ride.vehicle)} alt="" className="h-7 object-contain mix-blend-multiply" />
          </span>
          <div>
            <p className="flex items-center gap-1 text-xs font-semibold text-ink-700">
              <Calendar size={12} /> {formatDate(ride.createdAt)}
            </p>
            <p className="flex items-center gap-1 text-xs text-ink-400">
              <Clock size={12} /> {formatTime(ride.createdAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-base font-extrabold tracking-tight">₹{ride.fare}</p>
          <StatusPill status={ride.status} />
        </div>
      </div>
      <RouteTimeline pickup={ride.pickup} destination={ride.destination} compact />
    </div>
  );
};
export default RideHistory;
