import React, { useState, useEffect, useRef, useCallback } from "react";
import Peer from "simple-peer";
import io from "socket.io-client";
import Webcam from "react-webcam";

const Teacher = () => {
  const [yourID, setYourID] = useState<string>("");
  const [isMute, setIsMute] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream>();
  const [roomCode, setRoomCode] = useState<string>("");
  // eslint-disable-next-line
  const [ownSignal, setOwnSignal] = useState<any>({});
  const [callAccepted, setCallAccepted] = useState<boolean>(false);

  const [imgSrc, setImgSrc] = React.useState<string>("");

  const socket = useRef<any>();
  const partnerVideo = useRef<any>();

  const webcamRef = useRef<any>(null);

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
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

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
      setOwnSignal(data);
    });
    socket.current.on("fetch-teacher", () => {
      console.log("student has fetched teacher");
      setOwnSignal((prevOwnSignal: any) => {
        console.log(
          "sent offer SDP to room:",
          _roomId,
          ", offer:",
          prevOwnSignal
        );
        socket.current.emit("offer", {
          roomCode: _roomId,
          signalData: prevOwnSignal,
        });
        return prevOwnSignal;
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
  };

  const postImage = (imageData: string) => {
    console.log(
      "base64 data uri of image to be sent",
      imageData.substring(0, 100),
      "..."
    );
  };

  return (
    <>
      <h1>THIS IS TEACHER</h1>
      <div>
        <div>
          {stream && (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="stdBorder"
              />
              <button onClick={capture}>Capture photo</button>
              {imgSrc && (
                <>
                  <img src={imgSrc} />
                  <button onClick={() => postImage(imgSrc)}>
                    send picture
                  </button>
                </>
              )}
            </>
          )}
        </div>
        <div>
          {callAccepted && (
            <>
              <video
                className="stdBorder"
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
        </div>
      </div>
      <div>
        <button onClick={createRoomHandler}>Create Room</button>
      </div>
    </>
  );
};

export default Teacher;
