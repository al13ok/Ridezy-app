import { MapPinOff } from "lucide-react";
import { Button } from "../components";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center bg-ink-100 px-6 text-center">
      <div className="mb-6 flex h-24 w-24 animate-pop-in items-center justify-center rounded-full bg-white text-ink-900 shadow-float">
        <MapPinOff size={40} />
      </div>
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Looks like a wrong turn</h1>
      <p className="mb-8 mt-3 max-w-xs text-sm text-ink-500">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button title="Back to home" variant="brand" size="lg" fun={() => navigate("/")} />
    </div>
  );
};

export default Error;
