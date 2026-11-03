import { useEffect, useState } from "react";

import { ChevronRight, CircleUserRound, History, KeyRound, LogOut, Menu, X } from "lucide-react";
import Button from "./Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Console from "../utils/console";
import { Avatar, Logo } from "./ui";

function Sidebar() {
  const token = localStorage.getItem("token");
  const [showSidebar, setShowSidebar] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [newUser, setNewUser] = useState({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setNewUser(userData);
  }, []);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      setLoggingOut(true);
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/${newUser.type}/logout`, {
        headers: {
          token: token,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("messages");
      localStorage.removeItem("rideDetails");
      localStorage.removeItem("panelDetails");
      localStorage.removeItem("showPanel");
      localStorage.removeItem("showBtn");
      navigate("/");
    } catch (error) {
      Console.log("Error getting logged out", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const menu = [
    { to: `/${newUser?.type}/edit-profile`, label: "Edit profile", hint: "Name, phone & details", icon: CircleUserRound },
    { to: `/${newUser?.type}/rides`, label: "Ride history", hint: "All your past trips", icon: History },
    { to: `/${newUser?.type}/reset-password?token=${token}`, label: "Change password", hint: "Keep your account secure", icon: KeyRound },
  ];

  const fullname = newUser?.data?.fullname;

  return (
    <>
      {/* Toggle */}
      <button
        type="button"
        aria-label={showSidebar ? "Close menu" : "Open menu"}
        className="absolute left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink-900 shadow-float transition active:scale-95"
        onClick={() => {
          setShowSidebar(!showSidebar);
        }}
      >
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setShowSidebar(false)}
        className={`absolute inset-0 z-20 bg-ink-900/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          showSidebar ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`absolute bottom-0 left-0 top-0 z-20 flex w-[86%] flex-col justify-between bg-white px-5 pb-6 pt-20 transition-transform duration-300 ease-out ${
          showSidebar ? "translate-x-0 shadow-float" : "-translate-x-full"
        }`}
      >
        <div className="select-none">
          <div className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-700 p-5 text-white">
            <div className="flex items-center gap-4">
              <Avatar firstname={fullname?.firstname} lastname={fullname?.lastname} size="lg" className="ring-white/15" />
              <div className="min-w-0">
                <p className="truncate text-lg font-bold tracking-tight">
                  {fullname?.firstname} {fullname?.lastname}
                </p>
                <p className="truncate text-xs text-white/60">{newUser?.data?.email}</p>
                <span className="mt-2 inline-block rounded-full bg-brand-500/20 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-brand-300">
                  {newUser?.type === "captain" ? "Captain" : "Rider"}
                </span>
              </div>
            </div>
          </div>

          <nav className="mt-6 space-y-1">
            {menu.map(({ to, label, hint, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="group flex items-center justify-between rounded-2xl px-3 py-3 transition hover:bg-ink-50"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-700 transition group-hover:bg-brand-50 group-hover:text-brand-600">
                    <Icon size={19} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">{label}</p>
                    <p className="text-xs text-ink-400">{hint}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-ink-600" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <Button
            title={"Log out"}
            icon={<LogOut size={18} />}
            variant="danger"
            fun={logout}
            loading={loggingOut}
          />
          <Logo size="sm" className="mx-auto flex justify-center opacity-40" />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
