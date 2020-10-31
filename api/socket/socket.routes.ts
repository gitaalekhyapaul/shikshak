import socketIO from "socket.io";

export const socketController = (socket: socketIO.Socket) => {
  socket.on("create-room", (data, callback) => {
    console.log(data.id, "Wants to create room.");
    socket.join("room-code");
    callback("room-code");
  });
  socket.on("join-room", (data, callback) => {
    socket.join(data.roomCode);
    console.log(socket.id, "joined room:", data.roomCode);
    callback(data.roomCode);
  });
  socket.on("joined-room", (data) => {
    console.log("teacher is fetched for student", socket.id);
    socket.to(data.roomCode).broadcast.emit("fetch-teacher");
  });
  socket.on("offer", (data) => {
    console.log(socket.id, "has created an offer in room:", data.roomCode);
    socket.to(data.roomCode).broadcast.emit("call-offer", {
      signalData: data.signalData,
    });
  });

  socket.on("answer", (data) => {
    console.log("student has accepted offer");
    socket.to(data.roomCode).broadcast.emit("accept-answer", {
      signalData: data.signalData,
    });
  });
};
