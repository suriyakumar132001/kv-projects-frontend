// =========================================
// KV Projects ERP
// FaceCapture — reusable webcam capture component
// =========================================
//
// Used in two places:
//   - Add/Edit Employee → enrollment (captures the reference descriptor)
//   - Mark Attendance   → check-in (captures the descriptor to verify)
//
// This component only ever hands the *caller* a 128-number
// descriptor via onCapture(descriptor) — it never decides
// match/no-match itself. That decision happens server-side
// (see verifyFace() in attendanceController.js), same trust
// pattern as GPS: browser reports raw data, backend decides.
// =========================================

import { useEffect, useRef, useState, useCallback } from "react";
import { loadFaceApiModels, getFaceDescriptor } from "../utils/faceApiLoader";

const STATUS = {
  LOADING_MODELS: "loading-models",
  STARTING_CAMERA: "starting-camera",
  READY: "ready",
  CAPTURING: "capturing",
  CAMERA_ERROR: "camera-error",
  MODEL_ERROR: "model-error",
};

const FaceCapture = ({
  onCapture,
  onCancel,
  captureLabel = "Capture Face",
  helperText = "Center your face in the frame and click capture.",
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState(STATUS.LOADING_MODELS);
  const [message, setMessage] = useState("");

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    setStatus(STATUS.STARTING_CAMERA);
    setMessage("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 360 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStatus(STATUS.READY);
    } catch (err) {
      setStatus(STATUS.CAMERA_ERROR);
      setMessage(
        "Could not access the camera. Please allow camera permission and try again.",
      );
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    setStatus(STATUS.LOADING_MODELS);
    loadFaceApiModels()
      .then(() => {
        if (!cancelled) startCamera();
      })
      .catch(() => {
        if (!cancelled) {
          setStatus(STATUS.MODEL_ERROR);
          setMessage(
            "Could not load face recognition models. Check your connection and try again.",
          );
        }
      });

    return () => {
      cancelled = true;
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current) return;

    setStatus(STATUS.CAPTURING);
    setMessage("");

    const { descriptor, error } = await getFaceDescriptor(videoRef.current);

    if (error === "no-face") {
      setStatus(STATUS.READY);
      setMessage(
        "No face detected. Make sure your face is clearly visible and well lit.",
      );
      return;
    }

    if (error === "multiple-faces") {
      setStatus(STATUS.READY);
      setMessage(
        "Multiple faces detected. Make sure only one person is in frame.",
      );
      return;
    }

    setStatus(STATUS.READY);
    onCapture(descriptor);
  };

  const handleCancel = () => {
    stopCamera();
    if (onCancel) onCancel();
  };

  const isBusy =
    status === STATUS.LOADING_MODELS ||
    status === STATUS.STARTING_CAMERA ||
    status === STATUS.CAPTURING;

  return (
    <div className="face-capture">
      <div className="face-capture-video-wrap">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="face-capture-video"
        />

        {status === STATUS.LOADING_MODELS && (
          <div className="face-capture-overlay">
            Loading face recognition models…
          </div>
        )}
        {status === STATUS.STARTING_CAMERA && (
          <div className="face-capture-overlay">Starting camera…</div>
        )}
      </div>

      {helperText && status === STATUS.READY && (
        <p className="face-capture-helper">{helperText}</p>
      )}

      {message && <p className="face-capture-message">{message}</p>}

      <div className="face-capture-actions">
        <button type="button" onClick={handleCapture} disabled={isBusy}>
          {status === STATUS.CAPTURING ? "Capturing…" : captureLabel}
        </button>

        {onCancel && (
          <button type="button" onClick={handleCancel} className="secondary">
            Cancel
          </button>
        )}

        {status === STATUS.CAMERA_ERROR && (
          <button type="button" onClick={startCamera}>
            Retry Camera
          </button>
        )}

        {status === STATUS.MODEL_ERROR && (
          <button type="button" onClick={() => window.location.reload()}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default FaceCapture;
