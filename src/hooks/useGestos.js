import { useCallback, useEffect, useRef, useState } from "react";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export default function useGestos() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const ultimoTiempo = useRef(-1);

  const [estado, setEstado] = useState("inactivo"); // inactivo | cargando | activo | error
  const [error, setError] = useState("");
  const [puntero, setPuntero] = useState(null); // { x, y } entre 0 y 1

  const detener = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    landmarkerRef.current?.close();
    landmarkerRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setPuntero(null);
    setEstado("inactivo");
  }, []);

  const bucle = useCallback(() => {
    const video = videoRef.current;
    const detector = landmarkerRef.current;
    if (!video || !detector) return;

    if (video.readyState >= 2 && video.currentTime !== ultimoTiempo.current) {
      ultimoTiempo.current = video.currentTime;
      const res = detector.detectForVideo(video, performance.now());
      if (res.landmarks.length > 0) {
        const punta = res.landmarks[0][8]; // punta del dedo índice
        setPuntero({ x: 1 - punta.x, y: punta.y }); // 1 - x = efecto espejo
      } else {
        setPuntero(null);
      }
    }
    rafRef.current = requestAnimationFrame(bucle);
  }, []);

  const iniciar = useCallback(async () => {
    setEstado("cargando");
    setError("");
    try {
      const base = import.meta.env.BASE_URL;
      const vision = await FilesetResolver.forVisionTasks(`${base}wasm`);

      const opciones = (delegate) => ({
        baseOptions: { modelAssetPath: `${base}modelos/hand_landmarker.task`, delegate },
        runningMode: "VIDEO",
        numHands: 1,
      });

      try {
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, opciones("GPU"));
      } catch {
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, opciones("CPU"));
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setEstado("activo");
      rafRef.current = requestAnimationFrame(bucle);
    } catch (e) {
      console.error(e);
      detener();
      setError(
        e.name === "NotAllowedError"
          ? "No diste permiso para usar la cámara."
          : e.name === "NotFoundError"
          ? "No se encontró ninguna cámara."
          : "No se pudo iniciar la detección de manos."
      );
      setEstado("error");
    }
  }, [bucle, detener]);

  useEffect(() => detener, [detener]);

  return { videoRef, estado, error, puntero, iniciar, detener };
}