import { ChevronRight, Car, User } from "lucide-react";
import { Link } from "react-router-dom";

// Card at the bottom of auth screens to switch between Rider and Captain flows.
function RoleSwitch({ to, title, subtitle, captain = true }) {
  const Icon = captain ? Car : User;
  return (
    <div>
      <Link
        to={to}
        className="group flex items-center gap-3 rounded-2xl bg-ink-50 p-3 ring-1 ring-ink-200/70 transition hover:bg-white hover:shadow-soft"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-white">
          <Icon size={20} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold text-ink-900">{title}</p>
          <p className="text-xs text-ink-500">{subtitle}</p>
        </div>
        <ChevronRight size={18} className="text-ink-400 transition group-hover:translate-x-0.5 group-hover:text-ink-900" />
      </Link>
      <p className="mt-5 text-center text-[11px] text-ink-400">
        By continuing, you agree to Ridezy&apos;s Terms of Service and Privacy Policy.
      </p>
    </div>
  );
}

export default RoleSwitch;
