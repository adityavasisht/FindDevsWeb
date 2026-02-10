import io from "socket.io-client";

export const createSocketConnection = () => {

  if (location.hostname === "localhost") {
    return io("/", { path: "/api/socket.io" }); 
  } 

  else {
    return io("/", { path: "/socket.io" });
  }
};
