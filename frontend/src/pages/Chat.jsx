import { useEffect, useState } from "react";
import { createSocketConnection } from "../utils/socket"; 
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"; // Assuming you route to /chat/:targetUserId

const Chat = () => {
  const { targetUserId } = useParams(); // Get the ID of the person we are chatting with
  const user = useSelector((store) => store.user); // Get logged-in user details
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const [socket, setSocket] = useState(null);

  // 1. Setup the Socket Connection
  useEffect(() => {
    if (!user) return; // Wait until user is loaded

    const socketInstance = createSocketConnection();
    setSocket(socketInstance);

    // Emit 'joinChat' event to backend
    socketInstance.emit("joinChat", { 
        firstName: user.firstName, 
        userId: user._id, 
        targetUserId: targetUserId 
    });

    // Listen for incoming messages
    socketInstance.on("messageReceived", (msg) => {
        // Add new message to the list
        setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Cleanup: Disconnect when leaving the page
    return () => {
      socketInstance.disconnect();
    };
  }, [user, targetUserId]);

  const sendMessage = () => {
    if (!newMsg || !socket) return;

    // Emit 'sendMessage' event to backend
    socket.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user._id,
      targetUserId: targetUserId,
      text: newMsg,
    });

    // Optional: Add your own message to the list immediately (for speed)
    // Or wait for the server to broadcast it back (for consistency)
    setNewMsg("");
  };

  return (
    <div className="flex flex-col h-[80vh] w-full max-w-2xl mx-auto border border-gray-700 rounded-lg shadow-xl bg-base-200">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-base-300 rounded-t-lg">
        <h2 className="text-xl font-bold text-white">Chat Room</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
            const isMyMessage = msg.userId === user._id; // Check who sent it
            
            return (
              <div key={index} className={`chat ${isMyMessage ? "chat-end" : "chat-start"}`}>
                <div className="chat-header text-xs opacity-50 mb-1">
                  {msg.firstName}
                  <time className="text-xs opacity-50 ml-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
                <div className={`chat-bubble ${isMyMessage ? "chat-bubble-primary" : "chat-bubble-secondary"}`}>
                  {msg.text}
                </div>
              </div>
            );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700 bg-base-300 rounded-b-lg flex gap-2">
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="input input-bordered flex-1"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>

    </div>
  );
};

export default Chat;