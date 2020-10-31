import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const Teacher = () => {
  const [yourID, setYourID] = useState<string>("");
  const [stream, setStream] = useState<MediaStream>();
  const [roomCode, setRoomCode] = useState<string>("");
  const [ownSignal, setOwnSignal] = useState<any>({});
  const [callAccepted, setCallAccepted] = useState<boolean>(false);

  const socket = useRef<any>();
  const userVideo = useRef<any>();
  const partnerVideo = useRef<any>();

  useEffect(() => {
    socket.current = io.connect();
    socket.current.on("your-id", (id: string) => {
      setYourID(id);
    });
    console.log("socket connected with object:", socket.current);
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        setStream(stream);
      });

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });
  }, []);

  const createRoomHandler = () => {
    socket.current.emit(
      "create-room",
      {
        id: yourID,
      },
      (_roomCode: string) => {
        setRoomCode(_roomCode);
        console.log(_roomCode, "is the room you created");
        initiateCall(_roomCode);
      }
    );
  };

  const initiateCall = (_roomId: string) => {
    console.log("Call has been initiatied");
    console.log("stream-caller:", stream);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
        ],
      },
      stream,
    });

    socket.current.on("fetch-teacher", () => {
      console.log("student has fetched teacher");
      peer.on("signal", (data) => {
        console.log("sent offer SDP to room:", _roomId, ", offer:", data);
        setOwnSignal(data);
        socket.current.emit("offer", {
          roomCode: _roomId,
          signalData: data,
        });
      });
    });

    peer.on("stream", (_stream) => {
      console.log("teacher gets student stream", _stream);
      setCallAccepted(true);
      if (partnerVideo.current) {
        partnerVideo.current!.srcObject = _stream;
      }
    });

    socket.current!.on("accept-answer", (data: any) => {
      console.log("teacher gets student sdp", data.signalData);
      peer.signal(data.signalData);
    });
  };

  return (
    <>
      <h1>THIS IS TEACHER</h1>
      <div>
        <div>
          {stream && (
            <video
              className="stdBorder"
              playsInline
              muted
              ref={userVideo}
              autoPlay
            />
          )}
        </div>
        <div>
          {callAccepted && (
            <video
              className="stdBorder"
              playsInline
              ref={partnerVideo}
              autoPlay
            />
          )}
        </div>
      </div>
      <div>
        <button onClick={createRoomHandler}>Create Room</button>
      </div>
    </>
  );
};

export default Teacher;
