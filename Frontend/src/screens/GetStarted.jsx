import { useEffect } from "react";
import { ArrowRight, MessageCircle, Radio, ShieldCheck } from "lucide-react";
import { Button } from "../components/index";
import background from "/get_started_illustration.jpg";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/ui";

const features = [
  { icon: Radio, label: "Live ride updates" },
  { icon: ShieldCheck, label: "PIN-secured trips" },
  { icon: MessageCircle, label: "In-ride chat" },
];

function GetStarted() {
  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      if (JSON.parse(userData).type == "user") {
        navigate("/home");
      } else if (JSON.parse(userData).type == "captain") {
        navigate("/captain/home");
      }
    }
  }, []);
  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-brand-100">
      <div
        className="absolute inset-0 bg-cover bg-top"
        style={{ backgroundImage: `url(${background})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-ink-900/10" />

      <div className="relative z-[1] px-6 pt-7">
        <Logo />
      </div>

      <div className="relative z-[1] animate-slide-up rounded-t-[2.25rem] bg-white px-6 pb-8 pt-7 shadow-sheet">
        <p className="eyebrow text-brand-600">Rides in minutes</p>
        <h1 className="mt-2 text-[32px] font-extrabold leading-[1.1] tracking-tight text-ink-900">
          Move smarter
          <br />
          with <span className="text-brand-500">Ridezy</span>
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          Book a car, bike or auto with upfront fares and a captain who&apos;s just around the corner.
        </p>

        <div className="mb-7 mt-5 flex flex-wrap gap-2">
          {features.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 text-xs font-semibold text-ink-700 ring-1 ring-ink-200/70"
            >
              <Icon size={13} className="text-brand-600" />
              {label}
            </span>
          ))}
        </div>

        <div className="space-y-2.5">
          <Button
            title={"Get started"}
            path={"/login"}
            type={"link"}
            variant="brand"
            size="lg"
            icon={<ArrowRight size={19} />}
          />
          <Button title={"Drive with Ridezy"} path={"/captain/login"} type={"link"} variant="outline" />
        </div>
      </div>
    </div>
  );
}

export default GetStarted;
