import React, { useState, useEffect, useRef, useCallback } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import Webcam from "react-webcam";

import { postCalibration, postBoard } from "../../services/axios";

const Teacher = () => {
  const [yourID, setYourID] = useState<string>("");
  const [stream, setStream] = useState<MediaStream>();
  const [roomCode, setRoomCode] = useState<string>("");
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [isTeacherReady, setIsTeacherReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [isResponse, setIsResponse] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);

  const socket = useRef<any>();
  const partnerVideo = useRef<any>();
  const webcamRef = useRef<any>(null);

  let ownSignal: any;
  let boardSrc: string;

  useEffect(() => {
    socket.current = io.connect();
    socket.current.on("your-id", (id: string) => {
      setYourID(id);
    });
    console.log("socket connected with object:", socket.current);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
      });
  }, []);

  const capture = useCallback(() => {
    setShowCountdown(true);
    setCountdown(5);
    setTimeout(() => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      clearInterval(countdownInterval);
      setShowCountdown(false);
    }, 5000);
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);
  }, [webcamRef, setImgSrc]);

  const createRoomHandler = () => {
    setIsLoading(true);
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
            urls: process.env.REACT_APP_STUN_URLS,
            username: process.env.REACT_APP_STUN_USERNAME,
            credential: process.env.REACT_APP_STUN_CREDENTIALS,
          },
          {
            urls: process.env.REACT_APP_TURN_URLS,
            username: process.env.REACT_APP_TURN_USERNAME,
            credential: process.env.REACT_APP_TURN_CREDENTIALS,
          },
        ],
      },
      stream,
    });

    peer.on("signal", (data: any) => {
      ownSignal = data;
      setIsTeacherReady(true);
      setIsLoading(false);
    });

    socket.current.on("fetch-teacher", () => {
      console.log("student has fetched teacher");
      console.log("sent offer SDP to room:", _roomId, ", offer:", ownSignal);
      socket.current.emit("offer", {
        roomCode: _roomId,
        signalData: ownSignal,
      });
    });

    peer.on("stream", (_stream: MediaStream) => {
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

  const disconnect = () => {
    socket.current.emit("close-room", { roomCode });
    socket.current.close();
    socket.current.disconnect();
    console.log(stream);
    stream?.getTracks().forEach((track) => {
      track.enabled = false;
      track.stop();
    });
    partnerVideo.current!.srcObject = null;
    window.location.reload();
  };

  const postImage = (imageData: string) => {
    postCalibration({ roomId: roomCode, boardImg: imageData }).then((res) => {
      setImgSrc(res.imgUri);
      setIsResponse(true);
      console.log(res);
    });
  };

  const sendBoard = () => {
    setShowCountdown(true);
    setCountdown(5);
    setTimeout(() => {
      boardSrc = webcamRef.current.getScreenshot();
      clearInterval(countdownInterval);
      setShowCountdown(false);
      postBoard({ roomId: roomCode, boardImg: boardSrc }).then((res) => {
        console.log(res);
      });
    }, 5000);
    const countdownInterval = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);
  };

  return (
    <div className="stdContainer text-center min-h-screen">
      <h1 className="text-4xl w-full mt-10 h-auto">
        Namaste, <span className="font-bold">शिक्षक</span>!
      </h1>
      <div className="w-full">
        {stream && (
          <>
            {!imgSrc ? (
              <>
                {showCountdown && (
                  <>
                    <p className="text-2xl">
                      Capturing in:{" "}
                      <span className="font-bold">{countdown}</span>
                    </p>
                    <p className="text-2xl pb-2">Please move away</p>
                  </>
                )}
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  muted={true}
                  screenshotFormat="image/jpeg"
                  className="stdBorder mx-auto w-11/12 md:3/4 lg:w-2/5 shadow-2xl"
                  screenshotQuality={1}
                  mirrored={false}
                />
                {isTeacherReady && !isApproved && (
                  <button onClick={capture} className="stdButton">
                    Calibrate Board
                  </button>
                )}
              </>
            ) : (
              <>
                <img
                  src={imgSrc}
                  className="mx-auto w-11/12 md:3/4 lg:w-2/5 border-solid border-2 border-black"
                />
                {!isApproved && !isResponse ? (
                  <button
                    onClick={() => postImage(imgSrc)}
                    className="stdButton"
                  >
                    Send Preview
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setImgSrc("");
                      setIsApproved(true);
                    }}
                    className="stdButton"
                  >
                    Seems good!
                  </button>
                )}
                <button
                  onClick={() => {
                    setImgSrc("");
                    setIsResponse(false);
                  }}
                  className="rounded-md py-3 px-4 my-5 outline-none text-white bg-red-400 focus:outline-none mx-4"
                >
                  Click again
                </button>
              </>
            )}

            {isTeacherReady && roomCode ? (
              <>
                {isApproved && (
                  <button className="stdButton" onClick={sendBoard}>
                    Capture Board
                  </button>
                )}
                <h3 className="text-lg">
                  Your Room Code is :{" "}
                  <span className="font-bold text-xl">{roomCode}</span>
                </h3>
              </>
            ) : (
              <button
                onClick={createRoomHandler}
                className="rounded-md py-3 px-4 my-5 outline-none text-white bg-red-400 focus:outline-none mx-4"
              >
                {!isLoading ? "Create Room" : "Loading"}
              </button>
            )}
          </>
        )}
      </div>
      <div className="w-full">
        {callAccepted && (
          <>
            <video
              className="hidden"
              playsInline
              muted={false}
              ref={partnerVideo}
              autoPlay
            />
            <button
              onClick={disconnect}
              className="rounded-md py-3 px-4 my-5 outline-none text-white focus:outline-none mx-auto bg-red-400"
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Teacher;
