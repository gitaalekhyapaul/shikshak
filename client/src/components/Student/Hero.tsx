import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const Student = () => {
  const [yourID, setYourID] = useState<string>("");
  const [stream, setStream] = useState<MediaStream>();
  const [roomCode, setRoomCode] = useState<string>("");
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [teacherSignal, setTeacherSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<boolean>(false);

  const userVideo = useRef<HTMLVideoElement | null>(null);
  const partnerVideo = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>();
  const joinRoomInput = useRef<HTMLInputElement | null>(null);

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
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });
  }, []);

  const joinRoomHandler = (_roomCode: string) => {
    console.log("student joins room:", _roomCode);
    setRoomCode(_roomCode);
    socket.current.emit(
      "join-room",
      {
        roomCode: _roomCode,
      },
      callOfferhandler
    );
  };

  const callOfferhandler = (_roomCode: string) => {
    console.log("student has joined-room");
    socket.current.emit("joined-room", {
      roomCode: _roomCode,
    });

    socket.current.on("call-offer", (data: any) => {
      console.log("student receives teacher offer", data.signalData);
      setReceivingCall(true);
      setTeacherSignal(data.signalData);
    });
  };

  const acceptCallHandler = () => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      console.log("student answers teacher", data);
      socket.current.emit("answer", {
        signalData: data,
        roomCode,
      });
    });

    peer.on("stream", (_stream) => {
      console.log("student gets teacher stream", _stream);
      setCallAccepted(true);
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = _stream;
      }
    });
    peer.signal(teacherSignal);
  };

  return (
    <>
      <h1>THIS IS STUDENT</h1>
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
        {receivingCall && (
          <>
            <div>Receiving call-offer from the teacher</div>
            <button onClick={acceptCallHandler}>accept call</button>
          </>
        )}
        <input type="text" ref={joinRoomInput} className="stdBorder" />
        <button onClick={() => joinRoomHandler(joinRoomInput.current!.value)}>
          join room
        </button>
      </div>
    </>
  );
};

export default Student;
