"use client"
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

function ObjectDetect() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let detectInterval;

    const setupModelAndDetection = async () => {
      setLoading(true);
      const net = await cocoSSDLoad();
      setLoading(false);

      detectInterval = setInterval(() => {
        runObjectDetection(net);
      }, 1000); // Reduced frequency for performance
    };

    const runObjectDetection = async (net) => {
      if (
        webcamRef.current &&
        canvasRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const detectedObjects = await net.detect(webcamRef.current.video, undefined, 0.1);
        drawDetections(detectedObjects, canvas.getContext("2d"));
      }
    };

    const drawDetections = (detections, ctx) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      detections.forEach(({ bbox, class: objectClass, score }) => {
        const [x, y, width, height] = bbox;

        // Draw bounding box
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw label
        ctx.fillStyle = "red";
        ctx.font = "18px Arial";
        ctx.fillText(`${objectClass} (${(score * 100).toFixed(1)}%)`, x, y > 10 ? y - 5 : y + 20);
      });
    };

    setupModelAndDetection();

    return () => clearInterval(detectInterval);
  }, []);

  return (
    <div className="w-full mt-7">
      {loading ? (
        <div className="gradient-text">Loading AI model...</div>
      ) : (
        <div className="relative flex justify-center items-center gradient rounded-xl w-full">
          {/* Webcam */}
          <Webcam
            ref={webcamRef}
            className="h-[620px] rounded-lg w-full"
            muted
          />
          {/* Canvas for drawing */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-9999 h-[620px] rounded-lg w-full"
          />
        </div>
      )}
    </div>
  );
}

export default ObjectDetect;
