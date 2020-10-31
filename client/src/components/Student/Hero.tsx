import React, { useState, useEffect, useRef } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";

const Student = () => {
  const [yourID, setYourID] = useState<string>("");
  const [isMute, setIsMute] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();
  const [roomCode, setRoomCode] = useState<string>("");
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [teacherSignal, setTeacherSignal] = useState<any>();
  const [callAccepted, setCallAccepted] = useState<boolean>(false);

  const userVideo = useRef<HTMLVideoElement | null>(null);
  const partnerVideo = useRef<HTMLVideoElement | null>(null);
  const socket = useRef<any>();
  const joinRoomInput = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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

  // useEffect(() => {
  //   var ctx = canvasRef.current?.getContext("2d");
  //   var imgData = ctx?.createImageData(3, 3);
  //   for (var i = 0; i < imgData!.data.length; i += 4) {
  //     imgData!.data[i + 0] = 0;
  //     imgData!.data[i + 1] = 0;
  //     imgData!.data[i + 2] = 0;
  //     imgData!.data[i + 3] = 255;
  //   }
  // }, []);

  const points = [
    [10, 10],
    [10, 16],
    [100, 100],
    [200, 200],
    [200, 300],
    [200, 500],
  ];

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

  const toggleIsMuteHandler = () => {
    setIsMute(!isMute);
  };

  return (
    <div className="stdContainer text-center bg-gray-300 min-h-screen">
      <h1 className="text-4xl w-full mt-10">Good Morning, student!</h1>
      <div className="w-full">
        {stream && (
          <>
            {callAccepted && (
              <>
                <canvas
                  ref={canvasRef}
                  width={1280}
                  height={720}
                  className="border-solid border-2 border-black bg-white w-2/3 mx-auto"
                />
                <video
                  className="hidden"
                  playsInline
                  muted={isMute}
                  ref={partnerVideo}
                  autoPlay
                />
                <button onClick={toggleIsMuteHandler}>
                  {isMute ? "unmute" : "mute"}
                </button>
              </>
            )}
            {stream && (
              <video
                className="hidden"
                playsInline
                muted
                ref={userVideo}
                autoPlay
              />
            )}
          </>
        )}
      </div>

      <div>
        {receivingCall && (
          <>
            <div>Receiving call-offer from the teacher</div>
            <button onClick={acceptCallHandler}>Join Room</button>
          </>
        )}
        <input
          type="text"
          ref={joinRoomInput}
          className="stdBorder"
          name="room-code"
        />
        <button onClick={() => joinRoomHandler(joinRoomInput.current!.value)}>
          Find Room
        </button>
      </div>
    </div>
  );
};

export default Student;
