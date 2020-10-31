import React, { useState, useEffect, useRef, useCallback } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import Webcam from "react-webcam";

const Teacher = () => {
  const [yourID, setYourID] = useState<string>("");
  const [isMute, setIsMute] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();
  const [roomCode, setRoomCode] = useState<string>("");
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [isTeacherReady, setIsTeacherReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>("");

  const socket = useRef<any>();
  const partnerVideo = useRef<any>();
  const webcamRef = useRef<any>(null);

  let ownSignal: any;

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
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
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

    peer.on("signal", (data) => {
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

  const toggleIsMuteHandler = () => {
    setIsMute(!isMute);
    stream!.getAudioTracks()[0].enabled = !isMute;
  };

  const postImage = (imageData: string) => {
    console.log(
      "base64 data uri of image to be sent",
      imageData.substring(0, 100),
      "..."
    );
    setImgSrc("");
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
  };

  return (
    <div className="stdContainer text-center min-h-screen">
      <h1 className="text-4xl w-full mt-10">Good Morning, शिक्षक!</h1>
      <div className="w-full">
        {stream && (
          <>
            {!imgSrc ? (
              <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  muted={true}
                  screenshotFormat="image/jpeg"
                  className="stdBorder mx-auto w-2/5"
                  videoConstraints={videoConstraints}
                  screenshotQuality={1}
                />
              </>
            ) : (
              <>
                <img src={imgSrc} className="mx-auto w-2/5" />
                <button onClick={() => postImage(imgSrc)} className="stdButton">
                  Send Preview
                </button>
                <button onClick={() => setImgSrc("")} className="stdButton">
                  Take again
                </button>
              </>
            )}

            {isTeacherReady && roomCode ? (
              <>
                {!imgSrc && (
                  <button onClick={capture} className="stdButton">
                    Capture View
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
              onClick={toggleIsMuteHandler}
              className={`rounded-md py-3 px-4 my-5 outline-none text-white focus:outline-none mx-auto ${
                isMute ? " bg-green-400" : " bg-red-400"
              }`}
            >
              {isMute ? "Unmute" : "Mute"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Teacher;
