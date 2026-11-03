// Pure-CSS spinner (the old one loaded a GIF from an external website).
const sizes = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

function Spinner({ size = "sm", className = "" }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block shrink-0 rounded-full border-current border-r-transparent animate-spin ${sizes[size] || sizes.sm} ${className}`}
    />
  );
}

export default Spinner;
