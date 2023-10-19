import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { Navigate, NavigationType, useNavigate } from "react-router-dom";
import { Box, Button, Modal, Typography } from "@mui/material";

function CameraComponent() {
  const [isVideo, setIsvideo] = useState(false);
  const [abc, setAbc] = useState(false);
  const [image, setImage] = useState("");
  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log("first");
    // startCamera();
    if (count < 1) {
      videoRef && loadModels();
    }
  }, []);
  const videoRef = useRef(null);
  const canvasRef = useRef();
  // useEffect(() => {
  //   videoRef.current.innerHTML = "";
  //   canvasRef.current.innerHTML = "";
  // }, []);
  const navigate = useNavigate();
  console.log("count", count);
  const startCamera = async (value) => {
    console.log(value);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: value,
      });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };
  const stopCamera = () => {
    const stream = videoRef?.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    canvasRef.current.innerHTML = "";
  };
  const captureImage = () => {
    console.log("count ,in ", count);
    // if (count > 0) {
    //   stopCamera();
    //   startCamera(false);
    //   return;
    // }
    if (count < 1) {
      var countIn = 0;
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (video && canvas) {
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // You can now access the captured image data from the canvas.
        const capturedImage = canvas.toDataURL("image/png");
        console.log("Captured Image:", capturedImage);
        setImage(capturedImage);
        console.log("workingg");
        setCount(count + 1);
        countIn = countIn + 1;
        // setAbc(true);
        // navigate("/pricing");

        // return startCamera(false);
        // If you want to save the image or further process it, you can do so here.
      }
    }
  };
  console.log("abc", abc);
  useEffect(() => {
    if (count > 0) {
      // stopCamera();
      // navigate("/pricing");
    }
  }, [count]);
  const loadModels = () => {
    if (count > 0) {
      startCamera(false);
      return;
    }
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => {
      faceMyDetect();
    });
  };
  useEffect(() => {
    const a = async () => {
      await stopCamera();
      handleOpen();
      // window.location.reload();
      // navigate("/pricing");
    };
    if (image) {
      a();
    }
  }, [image]);
  const faceMyDetect = () => {
    if (!videoRef.current) {
      return;
    }

    const sss = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      console.log("detections", detections);

      if (detections.length) {
        await captureImage();
        clearInterval(sss);
      }

      if (videoRef.current) {
        canvasRef.current.innerHTML = await faceapi.createCanvasFromMedia(
          videoRef.current
        );

        faceapi.matchDimensions(canvasRef.current, {
          width: 940,
          height: 650,
        });

        const resized = faceapi.resizeResults(detections, {
          width: 940,
          height: 650,
        });

        faceapi.draw.drawDetections(canvasRef.current, resized);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resized);
        faceapi.draw.drawFaceExpressions(canvasRef.current, resized);
      }
    }, 1000);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    navigate("/pricing");
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <>
      <Button
        // type="submit"
        // fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 10 }}
        onClick={() => startCamera(true)}
      >
        open camera
      </Button>

      {/* <button style={{ margin: "20px" }} onClick={() => stopCamera()}>
        stop camera
      </button> */}
      <div className="myapp">
        <div className="appvide">
          <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
        </div>
        <canvas
          ref={canvasRef}
          width="940"
          height="650"
          className="appcanvas"
        />
        {/* <button onClick={captureImage}>Capture Image</button> */}
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Authenticated Successfully
          </Typography>
          <Button
            // type="submit"
            // fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 10 }}
            onClick={() => handleClose()}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default CameraComponent;
