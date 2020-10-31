import socketIO from "socket.io";
import nanoID from "nanoid";
import { CacheService } from "../services/nodecache.service";

export const socketController = (socket: socketIO.Socket) => {
  socket.on("create-room", (data, callback) => {
    console.log("socket::create-room -", data.id, "wants to create room.");
    const roomCode = nanoID.customAlphabet(
      "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      8
    )();
    socket.join(roomCode);
    console.log(
      "socket::create-room -",
      data.id,
      `created room: '${roomCode}'`
    );
    CacheService.getInstance().getCache().set(roomCode, true);
    callback(roomCode);
  });
  socket.on("join-room", (data, callback) => {
    const roomExists = CacheService.getInstance().getCache().get(data.roomCode);
    if (roomExists) {
      socket.join(data.roomCode);
      console.log(
        "socket::join-room -",
        socket.id,
        "joined room:",
        `'${data.roomCode}'.`
      );
      callback({
        success: true,
        _roomCode: data.roomCode,
      });
    } else {
      console.log(`socket::error - 'Room does not exist'.`);
      callback({
        success: false,
        error: "Room does not exist.",
      });
    }
  });
  socket.on("joined-room", (data) => {
    console.log(
      `socket::joined-room - teacher is fetched for student ${socket.id}.`
    );
    socket.to(data.roomCode).broadcast.emit("fetch-teacher");
  });
  socket.on("offer", (data) => {
    console.log(
      "socket::offer -",
      socket.id,
      "has created an offer in room:",
      `'${data.roomCode}'.`
    );
    socket.to(data.roomCode).broadcast.emit("call-offer", {
      signalData: data.signalData,
    });
  });
  socket.on("answer", (data) => {
    console.log(`socket::answer - student ${socket.id} has accepted offer.`);
    socket.to(data.roomCode).broadcast.emit("accept-answer", {
      signalData: data.signalData,
    });
  });
  socket.on("close-room", (data) => {
    console.log(`socket::close-room - room: '${data.roomCode}' is closed.`);
    socket.to(data.roomCode).broadcast.emit("close-student");
    CacheService.getInstance().getCache().del(data.roomCode);
    socket.disconnect(true);
  });
  socket.on("disconnect", () => {
    console.log("socket::disconnect - ", socket.id, "has disconnected.");
    socket.disconnect(true);
  });
};
