import { useEffect, useState } from "react";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import Button from "./Button";

const status = {
  success: { icon: CheckCircle2, tone: "bg-brand-50 text-brand-600", variant: "brand" },
  failure: { icon: XCircle, tone: "bg-red-50 text-red-600", variant: "dangerSolid" },
};

export const Alert = ({ heading, text, isVisible, onClose, type }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const config = status[type] || { icon: Info, tone: "bg-ink-100 text-ink-700", variant: "primary" };
  const Icon = config.icon;

  return (
    <div
      className={`absolute inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm transition-all duration-300 ${
        isAnimating ? "bg-ink-900/50" : "bg-ink-900/0"
      }`}
    >
      <div
        className={`w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-float transition-all duration-300 ${
          isAnimating ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${config.tone}`}>
          <Icon size={28} strokeWidth={2.2} />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-ink-900">{heading}</h1>
        <p className="mb-6 mt-2 text-pretty text-sm text-ink-500">{text}</p>
        <Button title={"Okay"} fun={onClose} variant={config.variant} />
      </div>
    </div>
  );
};
