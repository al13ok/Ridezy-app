import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  GetStarted,
  UserLogin,
  CaptainLogin,
  UserHomeScreen,
  CaptainHomeScreen,
  UserProtectedWrapper,
  CaptainProtectedWrapper,
  UserSignup,
  CaptainSignup,
  RideHistory,
  UserEditProfile,
  CaptainEditProfile,
  Error,
  ChatScreen,
  VerifyEmail,
  ResetPassword,
  ForgotPassword
} from "./screens/";
import { logger } from "./utils/logger";
import { SocketDataContext } from "./contexts/SocketContext";
import { useEffect, useContext } from "react";
import { ChevronLeft, MessageCircle, Radio, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { Logo } from "./components/ui";

// Desktop-only brand panel shown next to the phone-sized app.
function ShowcasePanel() {
  const points = [
    { icon: Radio, title: "Real-time matching", text: "Nearby captains get your request instantly over WebSockets." },
    { icon: ShieldCheck, title: "PIN-secured trips", text: "Every ride starts only after the rider's one-time PIN is verified." },
    { icon: MessageCircle, title: "In-ride chat", text: "Riders and captains coordinate the pickup in real time." },
  ];
  return (
    <div className="relative hidden h-full w-full select-none overflow-hidden bg-ink-900 sm:flex sm:flex-col sm:justify-between sm:p-12 lg:p-16">
      <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-10 h-[24rem] w-[24rem] rounded-full bg-sky-500/10 blur-3xl" />

      <Logo light size="lg" className="relative" />

      <div className="relative max-w-lg">
        <p className="eyebrow text-brand-300">Ride booking, reimagined</p>
        <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-white lg:text-5xl">
          Get there faster,
          <br />
          <span className="text-brand-400">ride smarter.</span>
        </h2>
        <div className="mt-10 space-y-5">
          {points.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[0.07] text-brand-300 ring-1 ring-white/10">
                <Icon size={20} />
              </span>
              <div>
                <p className="font-bold text-white">{title}</p>
                <p className="text-sm text-white/55">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="relative flex items-center gap-2 text-xs text-white/40">
        <Smartphone size={14} /> Best experienced on your phone
      </p>
    </div>
  );
}

function App() {
  return (
    <div className="w-full h-dvh flex items-center bg-ink-100">
      <div className="relative w-full sm:min-w-[400px] sm:w-[400px] h-full bg-white overflow-hidden sm:shadow-float">
        {/* Force Reset Button to clear data */}
        <div className="absolute top-36 -right-11 opacity-30 hover:opacity-100 z-50 flex items-center gap-1 rounded-l-2xl bg-white p-1 shadow-float hover:-translate-x-11 transition-all duration-300">
          <ChevronLeft size={18} className="text-ink-400" />
          <button aria-label="Reset app data" title="Reset app data" className="flex justify-center items-center w-10 h-10 rounded-xl bg-red-50 text-red-600" onClick={() => {
            alert("This will clear all your data and log you out to fix the app in case it got corrupted. Please confirm to proceed.");
            const confirmation = confirm("Are you sure you want to reset the app?")

            if (confirmation === true) {
              localStorage.clear();
              window.location.reload();
            }
          }}>
            <Trash2 strokeWidth={1.8} width={18} />
          </button>
        </div>

        <BrowserRouter>
          <LoggingWrapper />
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route
              path="/home"
              element={
                <UserProtectedWrapper>
                  <UserHomeScreen />
                </UserProtectedWrapper>
              }
            />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route
              path="/user/edit-profile"
              element={
                <UserProtectedWrapper>
                  <UserEditProfile />
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/user/rides"
              element={
                <UserProtectedWrapper>
                  <RideHistory />
                </UserProtectedWrapper>
              }
            />

            <Route
              path="/captain/home"
              element={
                <CaptainProtectedWrapper>
                  <CaptainHomeScreen />
                </CaptainProtectedWrapper>
              }
            />
            <Route path="/captain/login" element={<CaptainLogin />} />
            <Route path="/captain/signup" element={<CaptainSignup />} />
            <Route
              path="/captain/edit-profile"
              element={
                <CaptainProtectedWrapper>
                  <CaptainEditProfile />
                </CaptainProtectedWrapper>
              }
            />
            <Route
              path="/captain/rides"
              element={
                <CaptainProtectedWrapper>
                  <RideHistory />
                </CaptainProtectedWrapper>
              }
            />
            <Route path="/:userType/chat/:rideId" element={<ChatScreen />} />
            <Route path="/:userType/verify-email/" element={<VerifyEmail />} />
            <Route path="/:userType/forgot-password/" element={<ForgotPassword />} />
            <Route path="/:userType/reset-password/" element={<ResetPassword />} />

            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
      <ShowcasePanel />
    </div>
  );
}

export default App;

function LoggingWrapper() {
  const location = useLocation();
  const { socket } = useContext(SocketDataContext);

  useEffect(() => {
    if (socket) {
      logger(socket);
    }
  }, [location.pathname, location.search]);
  return null;
}