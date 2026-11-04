import axios from "axios";
import { ArrowLeft, MessageCircle, Phone, Send } from "lucide-react";
import { Avatar } from "../components/ui";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketDataContext } from "../contexts/SocketContext";
import Console from "../utils/console";
import Loading from "./Loading";

function ChatScreen() {
  const { rideId, userType } = useParams();
  const navigation = useNavigate();
  const scrollableDivRef = useRef(null);

  const { socket } = useContext(SocketDataContext);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [socketID, setSocketID] = useState({});

  const currentUser = JSON.parse(localStorage.getItem("userData"))?.data?._id || null;

  const scrollToBottom = () => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  };

  const getUserDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/ride/chat-details/${rideId}`,
        { headers: { token: localStorage.getItem("token") } }
      );

      //  Protecting unauthorised users to read the chats
      if (currentUser !== response.data.user._id && currentUser !== response.data.captain._id) {
        Console.log("You are not authorized to view this chat.");
        navigation(-1);
        return;
      }
      setMessages(response.data.messages);

      socket.emit("join-room", { rideId, token: localStorage.getItem("token") });
      if (userType == "user") {
        setUserData(response.data.captain);
      }
      if (userType == "captain") {
        setUserData(response.data.user);
      }
      const socketIds = {
        user: response.data.user.socketId,
        captain: response.data.captain.socketId,
      };
      setSocketID(socketIds);
    } catch {
      Console.log("No such ride exists.");
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    socket.emit("message", { rideId: rideId, msg: message, time });
    setMessages((prev) => [...prev, { msg: message, by: userType, time }]);

    setMessage("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (userData) {
      scrollToBottom();
    }
  }, [userData]);

  useEffect(() => {
    setTimeout(() => {

      getUserDetails();
    }, 3000);

    socket.on("receiveMessage", ({ msg, by, time }) => {
      setMessages((prev) => [...prev, { msg, by, time }]);
    });


    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  if (userData) {
    return (
      <div className="flex h-dvh flex-col bg-ink-100">
        {/* header */}
        <div className="flex h-fit items-center gap-3 border-b border-ink-200/70 bg-white px-4 pb-3 pt-4">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => navigation(-1)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-900 transition active:scale-95"
          >
            <ArrowLeft size={20} strokeWidth={2.4} />
          </button>
          <Avatar
            firstname={userData?.fullname?.firstname}
            lastname={userData?.fullname?.lastname}
            size="sm"
            tone={userType == "user" ? "ink" : "blue"}
            className="ring-2"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold tracking-tight">
              {userData?.fullname?.firstname} {userData?.fullname?.lastname}
            </p>
            <p className="text-xs text-brand-600">{userType == "user" ? "Your captain" : "Your rider"} · Ride chat</p>
          </div>
          {userData?.phone && (
            <a
              href={"tel:" + userData.phone}
              aria-label="Call"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-brand"
            >
              <Phone size={17} />
            </a>
          )}
        </div>

        <div className="h-full overflow-y-auto" ref={scrollableDivRef}>
          <div className="flex min-h-full w-full flex-col justify-end gap-1.5 p-4">
            {messages.length === 0 && (
              <div className="m-auto flex flex-col items-center text-center">
                <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink-400 shadow-soft">
                  <MessageCircle size={24} />
                </span>
                <p className="text-sm font-semibold text-ink-700">No messages yet</p>
                <p className="text-xs text-ink-400">Say hi and share your exact pickup spot.</p>
              </div>
            )}
            {messages.length > 0 &&
              messages.map((message, i) => {
                const mine = message.by == userType;
                return (
                  <div
                    key={i}
                    className={`max-w-[78%] animate-fade-in px-3.5 pb-1.5 pt-2 text-sm leading-snug shadow-soft ${
                      mine
                        ? "ml-auto rounded-2xl rounded-br-md bg-ink-900 text-white"
                        : "mr-auto rounded-2xl rounded-bl-md bg-white text-ink-900"
                    }`}
                  >
                    {message.msg}
                    <div className={`mt-0.5 text-right text-[10px] ${mine ? "text-white/50" : "text-ink-400"}`}>
                      {message.time}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Message */}
        <form className="flex h-fit items-center gap-2 border-t border-ink-200/70 bg-white p-3" onSubmit={sendMessage}>
          <input
            placeholder="Type a message…"
            className="h-12 w-full rounded-full bg-ink-100 px-5 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:bg-ink-50 focus:ring-2 focus:ring-ink-900/10"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoFocus
            spellCheck="false"
          />
          <button
            aria-label="Send message"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-brand transition hover:bg-brand-600 active:scale-95 disabled:opacity-50"
            disabled={!message.trim()}
          >
            <Send size={19} />
          </button>
        </form>
      </div>
    );
  } else {
    return <Loading />;
  }


}

export default ChatScreen;
