import { ArrowLeft, ChevronRight, User } from "lucide-react";
import { vehicleMeta } from "./ui";

const vehicles = [
  { id: 1, type: "car", description: "Comfy hatchbacks & sedans" },
  { id: 2, type: "bike", description: "Beat the traffic, solo rides" },
  { id: 3, type: "auto", description: "Everyday auto rickshaw rides" },
];

function SelectVehicle({ selectedVehicle, showPanel, setShowPanel, showPreviousPanel, showNextPanel, fare }) {
  return (
    <div
      className={`sheet transition-transform duration-500 ease-out ${
        showPanel ? "translate-y-0" : "pointer-events-none translate-y-[110%]"
      }`}
    >
      <div className="sheet-handle" />
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
          <h2 className="text-xl font-extrabold tracking-tight">Choose a ride</h2>
          <p className="text-xs text-ink-500">Upfront fares. No surprises.</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {vehicles.map((vehicle) => (
          <Vehicle
            key={vehicle.id}
            vehicle={vehicle}
            fare={fare}
            selectedVehicle={selectedVehicle}
            setShowPanel={setShowPanel}
            showNextPanel={showNextPanel}
          />
        ))}
      </div>
      <p className="mt-4 text-center text-[11px] text-ink-400">Pay by cash at the end of your trip</p>
    </div>
  );
}

const Vehicle = ({ vehicle, selectedVehicle, fare, setShowPanel, showNextPanel }) => {
  const meta = vehicleMeta[vehicle.type];
  return (
    <button
      type="button"
      onClick={() => {
        selectedVehicle(vehicle.type);
        setShowPanel(false);
        showNextPanel(true);
      }}
      className="group flex w-full items-center gap-3 rounded-2xl border-2 border-ink-100 bg-ink-50 p-3 text-left transition-all duration-200 hover:border-ink-900 hover:bg-white hover:shadow-soft active:scale-[0.99]"
    >
      <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-white">
        <img src={meta.image} alt={meta.label} className="h-12 w-16 object-contain mix-blend-multiply" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-[15px] font-bold tracking-tight text-ink-900">{meta.name}</h3>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-ink-500">
            <User size={12} strokeWidth={2.5} />
            {meta.seats}
          </span>
        </div>
        <p className="truncate text-xs text-ink-500">{vehicle.description}</p>
      </div>
      <div className="flex items-center gap-1 text-right">
        <span className="text-base font-extrabold tracking-tight text-ink-900">₹{fare?.[vehicle.type] ?? 0}</span>
        <ChevronRight size={16} className="text-ink-300 transition group-hover:text-ink-900" />
      </div>
    </button>
  );
};
export default SelectVehicle;
