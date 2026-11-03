import { Link } from "react-router-dom";
import Spinner from "./Spinner";

const variants = {
  primary: "bg-ink-900 text-white hover:bg-ink-800 shadow-soft",
  brand: "bg-brand-500 text-white hover:bg-brand-600 shadow-brand",
  secondary: "bg-ink-100 text-ink-900 hover:bg-ink-200",
  outline: "bg-white text-ink-900 border border-ink-200 hover:border-ink-900",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
  dangerSolid: "bg-red-600 text-white hover:bg-red-700",
  light: "bg-white/95 text-ink-900 hover:bg-white shadow-soft",
};

const sizes = {
  md: "h-12 text-[15px]",
  lg: "h-14 text-base",
  sm: "h-10 text-sm",
};

// Same props as before (path, title, icon, type, classes, fun, loading, loadingMessage, disabled)
// plus `variant` and `size`, so existing call sites keep working.
function Button({
  path,
  title,
  icon,
  type,
  classes = "",
  fun,
  loading,
  loadingMessage,
  disabled,
  variant = "primary",
  size = "md",
}) {
  const base = `w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 font-semibold tracking-tight select-none transition-all duration-200 active:scale-[0.98] ${variants[variant] || variants.primary} ${sizes[size] || sizes.md}`;

  if (type == "link") {
    return (
      <Link to={path} className={`${base} ${classes}`}>
        {title} {icon}
      </Link>
    );
  }

  return (
    <button
      type={type || "button"}
      className={`${base} disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${classes}`}
      onClick={fun}
      disabled={loading || disabled}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Spinner />
          {loadingMessage}
        </span>
      ) : (
        <>
          {title} {icon}
        </>
      )}
    </button>
  );
}

export default Button;
