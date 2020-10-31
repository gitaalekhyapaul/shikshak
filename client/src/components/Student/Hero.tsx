import React, { useState, useEffect, useRef, FormEvent } from "react";
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    var imgData = ctx?.createImageData(3, 3);
    if (imgData) {
      for (var i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i + 0] = 0;
        imgData.data[i + 1] = 0;
        imgData.data[i + 2] = 0;
        imgData.data[i + 3] = 255;
      }
      //@ts-ignore
      points.map((point) => ctx.putImageData(imgData, point[0], point[1]));
    }
  });

  const points = [
    [10, 10],
    [10, 16],
    [100, 100],
    [200, 200],
    [200, 300],
    [200, 500],
  ];

  const joinRoomHandler = (e: FormEvent) => {
    e.preventDefault();
    let _roomCode = joinRoomInput.current!.value;
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

  const callOfferhandler = (data: {
    success: boolean;
    _roomCode: string;
    error?: string;
  }) => {
    if (data.success) {
      console.log("student has joined-room");
      socket.current.emit("joined-room", {
        roomCode: data._roomCode,
      });

      socket.current.on("call-offer", (data: any) => {
        console.log("student receives teacher offer", data.signalData);
        setReceivingCall(true);
        setTeacherSignal(data.signalData);
      });
    } else {
      console.log(data.error);
    }
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
    stream!.getAudioTracks()[0].enabled = !isMute;
  };

  return (
    <div className="stdContainer text-center min-h-screen">
      <h1 className="text-sm sm:text-2xl md:text-3xl lg:text-4xl w-full mt-1 md:mt-10">
        Good Morning, student!
      </h1>
      <div className="w-full">
        {stream && (
          <>
            {callAccepted && (
              <>
                <div className="w-11/12 mx-auto overflow-scroll">
                  <canvas
                    ref={canvasRef}
                    width={1280}
                    height={720}
                    className="border-solid border-2 border-black bg-white mx-auto"
                  />
                </div>
                <video
                  className="hidden"
                  playsInline
                  muted={false}
                  ref={partnerVideo}
                  autoPlay
                />
                <button
                  onClick={toggleIsMuteHandler}
                  className={`rounded-md py-3 px-4 my-5 outline-none text-white focus:outline-none mx-auto ${
                    isMute ? " bg-green-400" : " bg-red-400"
                  }`}
                >
                  {isMute ? "Unmute" : "Mute"}
                </button>
              </>
            )}
            {stream && (
              <video
                className="hidden"
                playsInline
                muted={true}
                ref={userVideo}
                autoPlay
              />
            )}
          </>
        )}
      </div>

      <div className="mx-auto">
        {!callAccepted && (
          <form onSubmit={joinRoomHandler}>
            <input
              type="text"
              ref={joinRoomInput}
              className="stdBorder pl-4 py-3"
              name="room-code"
              placeholder="Room Code"
            />
            {receivingCall ? (
              <>
                <button
                  onClick={acceptCallHandler}
                  className="stdButton"
                  type="button"
                >
                  Join Room
                </button>
              </>
            ) : (
              <>
                <button type="submit" className="stdButton">
                  Find Room
                </button>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Student;
