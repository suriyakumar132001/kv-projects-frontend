// =========================================
// KV Projects ERP
// face-api.js Model Loader
// =========================================
//
// Loads the three models used for enrollment + check-in:
//   - tinyFaceDetector   → finds the face in the frame (fast, small)
//   - faceLandmark68Net  → aligns the face before descriptor extraction
//   - faceRecognitionNet → produces the 128-number descriptor
//
// Models are served as static files from public/models (see
// public/models/*), so they load over the same origin — no CDN,
// no third party ever sees a frame from the webcam.
//
// loadFaceApiModels() is idempotent and safe to call from multiple
// components (Add/Edit Employee, Mark Attendance) — the first call
// does the work, later calls reuse the same in-flight/resolved
// promise instead of reloading ~6MB of weights again.
// =========================================

import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

let loadingPromise = null;
let modelsLoaded = false;

export const loadFaceApiModels = () => {
  if (modelsLoaded) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  ])
    .then(() => {
      modelsLoaded = true;
    })
    .catch((err) => {
      // Reset so a retry (e.g. after the network comes back) tries
      // again instead of being stuck on a rejected promise forever.
      loadingPromise = null;
      throw err;
    });

  return loadingPromise;
};

export const areModelsLoaded = () => modelsLoaded;

// =========================================
// getFaceDescriptor
// =========================================
//
// Runs detection + landmark alignment + descriptor extraction on a
// single video frame (or image element). Returns:
//   { descriptor: number[128], error: null }               on success
//   { descriptor: null, error: "no-face" }                 nobody in frame
//   { descriptor: null, error: "multiple-faces" }           more than one face
//
// Deliberately refuses to guess when more than one face is in
// frame — enrollment/check-in should only ever compare exactly one
// person, not silently pick whichever face the detector ranks first.
// =========================================
export const getFaceDescriptor = async (mediaElement) => {
  const detections = await faceapi
    .detectAllFaces(mediaElement, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (detections.length === 0) {
    return { descriptor: null, error: "no-face" };
  }

  if (detections.length > 1) {
    return { descriptor: null, error: "multiple-faces" };
  }

  return {
    descriptor: Array.from(detections[0].descriptor),
    error: null,
  };
};

// =========================================
// checkBlinkLiveness
// =========================================
//
// ⚠️ LIMITATION — READ BEFORE RELYING ON THIS ⚠️
//
// This is a free, on-device, "reasonable basic anti-photo measure"
// as opposed to real liveness/anti-spoofing security. It watches
// the eyes over a short window and confirms they closed and
// reopened once (a genuine blink cycle) using the standard Eye
// Aspect Ratio (EAR) formula from face-api.js's 68-point landmarks.
//
// What it DOES catch:
//   - a static printed photo held up to the camera
//   - a still image file
//
// What it does NOT catch (documented, not silently ignored):
//   - a pre-recorded video/GIF of the real employee blinking,
//     played back on another phone or screen in front of the camera
//   - 3D masks or more advanced spoofing
//
// A real, reliable liveness/anti-spoofing guarantee needs a paid
// liveness-detection API/SDK — out of scope here, since this project
// is built on free/open-source/on-device tooling only. Treat the
// result (see livenessVerified in the Attendance model) the same
// way as locationVerified/faceVerified: a signal for Admin/Owner to
// review, never a hard block on its own — see checkIn() in
// attendanceController.js.
//
// Resolves to `true` if a blink was detected within durationMs,
// `false` if the window elapsed without one (still lets the caller
// decide whether to allow capture anyway — see FaceCapture.jsx).
// =========================================

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

// Standard 6-point EAR formula (Soukupová & Čech, 2016). face-api.js's
// getLeftEye()/getRightEye() return the 6 points in the same order
// the formula expects.
const eyeAspectRatio = (eyePoints) => {
  const [p1, p2, p3, p4, p5, p6] = eyePoints;
  return (dist(p2, p6) + dist(p3, p5)) / (2 * dist(p1, p4));
};

const EAR_CLOSED_THRESHOLD = 0.23; // below this: eyes considered closed
const EAR_REOPEN_THRESHOLD = 0.26; // above this after closing: blink confirmed

export const checkBlinkLiveness = async (
  videoElement,
  { durationMs = 4000, sampleIntervalMs = 150 } = {},
) => {
  const start = Date.now();
  let eyesWereClosed = false;

  while (Date.now() - start < durationMs) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const detection = await faceapi
        .detectSingleFace(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();

      if (detection) {
        const leftEAR = eyeAspectRatio(detection.landmarks.getLeftEye());
        const rightEAR = eyeAspectRatio(detection.landmarks.getRightEye());
        const avgEAR = (leftEAR + rightEAR) / 2;

        if (avgEAR < EAR_CLOSED_THRESHOLD) {
          eyesWereClosed = true;
        } else if (eyesWereClosed && avgEAR > EAR_REOPEN_THRESHOLD) {
          return true; // full closed → open cycle seen = blink confirmed
        }
      }
    } catch {
      // A single failed frame shouldn't kill the whole check — keep
      // sampling until durationMs runs out.
    }

    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, sampleIntervalMs));
  }

  return false; // window elapsed, no confirmed blink
};
