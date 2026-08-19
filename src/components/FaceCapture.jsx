// ===============================================
// KV Projects ERP
// FaceCapture — reusable webcam capture component
// ===============================================
//
// Used in two places:
//   - Add/Edit Employee → enrollment
//   - Mark Attendance   → check-in verification
//
// This component captures a face descriptor and
// sends it to the parent through onCapture().
// ===============================================

import { useEffect, useRef, useState, useCallback } from "react";
import {
  loadFaceApiModels,
  getFaceDescriptor,
  checkBlinkLiveness,
} from "../utils/faceApiLoader";

import "./FaceCapture.css";

const STATUS = {
  LOADING_MODELS: "loading-models",
  STARTING_CAMERA: "starting-camera",
  READY: "ready",
  CHECKING_LIVENESS: "checking-liveness",
  CAPTURING: "capturing",
  CAMERA_ERROR: "camera-error",
  MODEL_ERROR: "model-error",
};

const FaceCapture = ({
  onCapture,
  onCancel,
  captureLabel = "Capture Face",
  helperText = "Center your face in the frame and click capture.",
  // When true (Mark Attendance passes this), a short blink check runs
  // before the descriptor is extracted, and onCapture is called with
  // a second argument: onCapture(descriptor, livenessVerified).
  //
  // IMPORTANT: this is a basic anti-photo measure, not strong
  // liveness/anti-spoofing security — see the disclaimer on
  // checkBlinkLiveness in faceApiLoader.js for exactly what it does
  // and doesn't protect against. It flags, it never blocks capture —
  // callers that ignore the second argument keep working unchanged.
  requireLiveness = false,
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState(STATUS.LOADING_MODELS);
  const [message, setMessage] = useState("");

  // ===============================================
  // STOP CAMERA
  // ===============================================

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // ===============================================
  // START CAMERA
  // ===============================================

  const startCamera = useCallback(async () => {
    setStatus(STATUS.STARTING_CAMERA);
    setMessage("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not supported.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: {
            ideal: 480,
          },
          height: {
            ideal: 360,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        try {
          await videoRef.current.play();
        } catch {
          // Browser may automatically handle playback.
        }
      }

      setStatus(STATUS.READY);
    } catch (error) {
      console.error("Camera error:", error);

      setStatus(STATUS.CAMERA_ERROR);

      setMessage(
        "Could not access the camera. Please allow camera permission and try again.",
      );
    }
  }, []);

  // ===============================================
  // LOAD FACE API MODELS + START CAMERA
  // ===============================================

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      setStatus(STATUS.LOADING_MODELS);
      setMessage("");

      try {
        await loadFaceApiModels();

        if (!cancelled) {
          await startCamera();
        }
      } catch (error) {
        console.error("Face API model error:", error);

        if (!cancelled) {
          setStatus(STATUS.MODEL_ERROR);

          setMessage(
            "Could not load face recognition models. Check your connection and try again.",
          );
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // ===============================================
  // CAPTURE FACE
  // ===============================================

  const handleCapture = async () => {
    if (!videoRef.current) {
      return;
    }

    let livenessVerified = null;

    if (requireLiveness) {
      setStatus(STATUS.CHECKING_LIVENESS);
      setMessage("");

      try {
        livenessVerified = await checkBlinkLiveness(videoRef.current);
      } catch (error) {
        console.error("Liveness check error:", error);
        livenessVerified = false;
      }
    }

    setStatus(STATUS.CAPTURING);
    setMessage("");

    try {
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

      if (error || !descriptor) {
        setStatus(STATUS.READY);

        setMessage(
          "Unable to capture your face. Please position your face clearly and try again.",
        );

        return;
      }

      setStatus(STATUS.READY);

      if (requireLiveness && livenessVerified === false) {
        setMessage(
          "Liveness check didn't confirm a blink — captured anyway, but this may be flagged for review.",
        );
      }

      if (typeof onCapture === "function") {
        onCapture(descriptor, livenessVerified);
      }
    } catch (error) {
      console.error("Face capture error:", error);

      setStatus(STATUS.READY);

      setMessage("Face capture failed. Please try again.");
    }
  };

  // ===============================================
  // CANCEL
  // ===============================================

  const handleCancel = () => {
    stopCamera();

    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  // ===============================================
  // BUSY STATE
  // ===============================================

  const isBusy =
    status === STATUS.LOADING_MODELS ||
    status === STATUS.STARTING_CAMERA ||
    status === STATUS.CHECKING_LIVENESS ||
    status === STATUS.CAPTURING;

  // ===============================================
  // UI
  // ===============================================

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

        {status === STATUS.CAMERA_ERROR && (
          <div className="face-capture-overlay">Camera access required</div>
        )}

        {status === STATUS.MODEL_ERROR && (
          <div className="face-capture-overlay">
            Face recognition unavailable
          </div>
        )}

        {status === STATUS.CHECKING_LIVENESS && (
          <div className="face-capture-overlay">Please blink naturally…</div>
        )}
      </div>

      {requireLiveness && status === STATUS.READY && (
        <p className="face-capture-helper face-capture-liveness-note">
          A quick blink check runs when you capture — this is a basic anti-photo
          check, not full liveness security.
        </p>
      )}

      {helperText && status === STATUS.READY && (
        <p className="face-capture-helper">{helperText}</p>
      )}

      {message && <p className="face-capture-message">{message}</p>}

      <div className="face-capture-actions">
        <button
          type="button"
          onClick={handleCapture}
          disabled={isBusy || status !== STATUS.READY}
        >
          {status === STATUS.CHECKING_LIVENESS
            ? "Checking…"
            : status === STATUS.CAPTURING
              ? "Capturing…"
              : captureLabel}
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
