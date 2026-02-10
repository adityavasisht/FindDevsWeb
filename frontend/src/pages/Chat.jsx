import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import axios from "axios";
import { addUser } from "../utils/userSlice"; 

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const [socket, setSocket] = useState(null);

  // 1. Load User Profile if missing (Refresh handling)
  useEffect(() => {
    if (!user) {
      axios.get("/api/profile/view")
        .then((res) => dispatch(addUser(res.data)))
        .catch(() => console.error("Please login"));
    }
  }, [user, dispatch]);

  // 2. Initialize Socket & Fetch History
  useEffect(() => {
    if (!user) return;

    // Fetch Old Messages
    axios.get("/api/chat/" + targetUserId)
      .then((res) => {
        setMessages(res.data.messages || []);
      })
      .catch((err) => console.error(err));

    // Connect Socket
    const newSocket = io("/", { 
        path: "/socket.io", 
        withCredentials: true 
    });

    setSocket(newSocket);

    newSocket.emit("joinChat", {
      firstName: user.firstName,
      userId: user._id,
      targetUserId,
    });

    newSocket.on("messageReceived", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => newSocket.disconnect();
  }, [user, targetUserId]);

  // 3. Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Send Message Function
  const sendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user._id,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  if (!user) return <div className="flex justify-center h-screen items-center">Loading...</div>;

  return (
    <div className="flex justify-center items-center h-[85vh] w-full mt-2 px-2">
      <div className="w-full max-w-3xl h-[80vh] bg-base-300 rounded-xl shadow-xl flex flex-col overflow-hidden border border-base-content/10">

        {/* Chat Header */}
        <div className="bg-neutral p-4 text-neutral-content flex items-center gap-4 shadow-md z-10">
           <div className="avatar online">
              <div className="w-10 rounded-full bg-base-100 ring ring-primary ring-offset-base-100 ring-offset-2">
                 <img src="https://geeks-of-code.s3.ap-south-1.amazonaws.com/dev-tinder-placeholder.jpg" />
              </div>
           </div>
           <div>
             <h2 className="font-bold text-lg">Chat Room</h2>
             <p className="text-xs opacity-70">Active Now</p>
           </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-100">
          {messages.length === 0 && (
             <div className="text-center text-gray-500 mt-10">
                <p>Start the conversation! 👋</p>
             </div>
          )}

          {messages.map((msg, index) => {
            const isMe = msg.senderId === user._id;
            return (
              <div key={index} className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                <div className="chat-image avatar">
                  <div className="w-10 rounded-full">
                    <img src={isMe ? user.photoUrl : "https://geeks-of-code.s3.ap-south-1.amazonaws.com/dev-tinder-placeholder.jpg"} />
                  </div>
                </div>
                <div className="chat-header opacity-50 text-xs mb-1">
                  {msg.firstName}
                  <time className="text-xs opacity-50 ml-1">
                     {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </time>
                </div>
                <div className={`chat-bubble ${isMe ? "chat-bubble-primary text-white" : "chat-bubble-secondary text-white"}`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={scrollRef}></div>
        </div>

        {/* Input Field */}
        <div className="p-4 bg-neutral border-t border-base-content/10">
          <div className="join w-full">
            <input
              type="text"
              className="input input-bordered join-item w-full focus:outline-none"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-primary join-item px-6" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
