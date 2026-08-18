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
