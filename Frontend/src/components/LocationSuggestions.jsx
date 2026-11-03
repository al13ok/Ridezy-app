import { MapPin } from "lucide-react";
import Console from "../utils/console";

function LocationSuggestions({ suggestions = [], setSuggestions, setPickupLocation, setDestinationLocation, input }) {
  return (
    <div className="mt-1">
      <p className="eyebrow mb-1 px-1">{input == "pickup" ? "Pickup suggestions" : "Drop-off suggestions"}</p>
      {suggestions.map((suggestion, index) => (
        <button
          type="button"
          onClick={() => {
            Console.log(suggestion);
            if (input == "pickup") {
              setPickupLocation(suggestion);
              setSuggestions([]);
            }
            if (input == "destination") {
              setDestinationLocation(suggestion);
              setSuggestions([]);
            }
          }}
          key={index}
          className="flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition hover:bg-ink-50"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600">
            <MapPin size={17} />
          </span>
          <span className="truncate text-sm font-semibold text-ink-900">{suggestion}</span>
        </button>
      ))}
    </div>
  );
}

export default LocationSuggestions;
