// Shared presentational building blocks for the Ridezy UI.
// No API / socket logic lives here – only markup and styling.
import { ArrowLeft, Bike, Car, Users } from "lucide-react";

/* ---------- Brand ---------- */

export function LogoMark({ className = "w-9 h-9" }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="12" className="fill-brand-500" />
      <path
        d="M20 9.5c-4.7 0-8.5 3.7-8.5 8.3 0 6 7.2 12.3 7.6 12.6.5.4 1.3.4 1.8 0 .4-.3 7.6-6.6 7.6-12.6 0-4.6-3.8-8.3-8.5-8.3Z"
        fill="#fff"
      />
      <circle cx="20" cy="17.8" r="3.3" className="fill-brand-500" />
    </svg>
  );
}

export function Logo({ className = "", light = false, size = "md" }) {
  const markSize = size === "lg" ? "w-11 h-11" : size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const textSize = size === "lg" ? "text-3xl" : size === "sm" ? "text-lg" : "text-2xl";
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={markSize} />
      <span className={`${textSize} font-extrabold tracking-tight ${light ? "text-white" : "text-ink-900"}`}>
        Ridezy
      </span>
    </div>
  );
}

/* ---------- People ---------- */

const avatarTones = {
  brand: "from-brand-400 to-brand-600",
  ink: "from-ink-700 to-ink-900",
  blue: "from-sky-400 to-indigo-500",
  amber: "from-amber-400 to-orange-500",
};

export function Avatar({ firstname = "", lastname = "", size = "md", tone = "brand", className = "" }) {
  const sizes = {
    sm: "w-9 h-9 text-xs",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-xl",
    xl: "w-24 h-24 text-3xl",
  };
  const initials = `${firstname?.[0] || ""}${lastname?.[0] || ""}`.toUpperCase() || "?";
  return (
    <div
      className={`flex shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ring-4 ring-white ${avatarTones[tone] || avatarTones.brand} ${sizes[size] || sizes.md} ${className}`}
    >
      {initials}
    </div>
  );
}

/* ---------- Layout ---------- */

export function IconButton({ onClick, children, label, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-ink-900 shadow-float transition active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
}

export function PageHeader({ title, subtitle, onBack, right }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 bg-ink-100/85 px-4 pb-3 pt-5 backdrop-blur">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-ink-900 shadow-soft transition active:scale-95"
        >
          <ArrowLeft size={20} strokeWidth={2.4} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-xl font-extrabold tracking-tight text-ink-900">{title}</h1>
        {subtitle && <p className="truncate text-xs text-ink-500">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

// Layout for login / signup screens: brand bar, content, optional footer.
export function AuthLayout({ children, footer, badge }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-y-auto bg-white">
      <div className="flex items-center justify-between px-6 pt-7">
        <Logo size="sm" />
        {badge && (
          <span className="rounded-full bg-ink-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
            {badge}
          </span>
        )}
      </div>
      <div className="flex-1 animate-slide-up px-6 pt-9">{children}</div>
      {footer && <div className="px-6 pb-7 pt-6">{footer}</div>}
    </div>
  );
}

/* ---------- Ride bits ---------- */

const statusStyles = {
  pending: { label: "Searching", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  accepted: { label: "Captain arriving", cls: "bg-sky-50 text-sky-700 ring-sky-200" },
  ongoing: { label: "On trip", cls: "bg-brand-50 text-brand-700 ring-brand-200" },
  completed: { label: "Completed", cls: "bg-ink-100 text-ink-700 ring-ink-200" },
  cancelled: { label: "Cancelled", cls: "bg-red-50 text-red-600 ring-red-200" },
};

export function StatusPill({ status }) {
  const s = statusStyles[status] || { label: status || "Unknown", cls: "bg-ink-100 text-ink-600 ring-ink-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  );
}

// Splits "Place, City, State" into a bold title and a muted subtitle.
function splitAddress(address = "") {
  const parts = String(address || "").split(", ");
  return { title: parts[0] || "", rest: parts.slice(1).join(", ") };
}

export function RouteTimeline({ pickup, destination, compact = false }) {
  const from = splitAddress(pickup);
  const to = splitAddress(destination);
  const titleCls = compact ? "text-sm" : "text-[15px]";
  return (
    <div className="relative">
      <div className="absolute bottom-[22px] left-[7px] top-[22px] w-0.5 bg-gradient-to-b from-brand-500 to-ink-900" />
      <div className="flex gap-3 pb-3">
        <span className="relative z-[1] mt-1 h-4 w-4 shrink-0 rounded-full border-[4px] border-brand-500 bg-white" />
        <div className="min-w-0">
          <p className="eyebrow">Pickup</p>
          <p className={`${titleCls} truncate font-semibold text-ink-900`} title={pickup}>
            {from.title || "—"}
          </p>
          {from.rest && <p className="truncate text-xs text-ink-500">{from.rest}</p>}
        </div>
      </div>
      <div className="flex gap-3">
        <span className="relative z-[1] mt-1 h-4 w-4 shrink-0 rounded-[5px] border-[4px] border-ink-900 bg-white" />
        <div className="min-w-0">
          <p className="eyebrow">Drop-off</p>
          <p className={`${titleCls} truncate font-semibold text-ink-900`} title={destination}>
            {to.title || "—"}
          </p>
          {to.rest && <p className="truncate text-xs text-ink-500">{to.rest}</p>}
        </div>
      </div>
    </div>
  );
}

export const vehicleMeta = {
  car: { name: "Ridezy Go", label: "Car", image: "/car.png", seats: 4, icon: Car },
  bike: { name: "Ridezy Moto", label: "Bike", image: "/bike.webp", seats: 1, icon: Bike },
  auto: { name: "Ridezy Auto", label: "Auto", image: "/auto.webp", seats: 3, icon: Users },
};

export function vehicleImage(type) {
  return (vehicleMeta[type] || vehicleMeta.car).image;
}

// Indian-style number plate
export function NumberPlate({ number }) {
  return (
    <span className="inline-flex items-center rounded-md border-2 border-ink-900 bg-amber-300 px-2 py-0.5 font-mono text-[13px] font-bold uppercase tracking-wider text-ink-900">
      {number || "—"}
    </span>
  );
}

// Radio cards for picking vehicle type; registers the same "type" field as the old <select>.
export function VehicleTypePicker({ register, name = "type", defaultValue = "car", error }) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 block text-[13px] font-semibold text-ink-700">Vehicle type</p>
      <div className="grid grid-cols-3 gap-2">
        {["car", "bike", "auto"].map((type) => (
          <label key={type} className="cursor-pointer">
            <input
              type="radio"
              value={type}
              {...register(name)}
              defaultChecked={(defaultValue || "car") === type}
              className="peer sr-only"
            />
            <div className="flex flex-col items-center rounded-2xl border-2 border-ink-200 bg-ink-50 px-2 pb-2 pt-3 transition peer-checked:border-ink-900 peer-checked:bg-white peer-checked:shadow-soft">
              <img src={vehicleImage(type)} alt="" className="h-10 object-contain mix-blend-multiply" />
              <span className="mt-1 text-xs font-semibold text-ink-900">{vehicleMeta[type].label}</span>
            </div>
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error.message}</p>}
    </div>
  );
}

export function Divider({ className = "" }) {
  return <div className={`h-px w-full bg-ink-200/80 ${className}`} />;
}
