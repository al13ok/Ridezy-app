import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// Same props as before; `icon` is optional. Password fields get a show/hide toggle.
function Input({ label, type, name, placeholder, defaultValue, register, error, options, disabled, icon: Icon }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type || "text";

  const fieldClasses = `w-full h-12 rounded-xl border bg-ink-50 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all duration-200 focus:bg-white focus:ring-4 ${
    error
      ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
      : "border-ink-200 focus:border-ink-900 focus:ring-ink-900/5"
  } ${Icon ? "pl-11" : "pl-4"} ${isPassword ? "pr-11" : "pr-4"} ${
    disabled ? "cursor-not-allowed select-none text-ink-400 bg-ink-100" : ""
  }`;

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={name} className="mb-1.5 block text-[13px] font-semibold text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
        )}
        {type == "select" ? (
          <select id={name} {...register(name)} defaultValue={defaultValue} className={`${fieldClasses} appearance-none`}>
            {options.map((option) => (
              <option key={option} value={option.toLowerCase()}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            {...register(name)}
            type={inputType}
            placeholder={placeholder || label}
            className={fieldClasses}
            disabled={disabled}
            defaultValue={defaultValue}
          />
        )}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-400 hover:text-ink-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error.message}</p>}
    </div>
  );
}

export default Input;
