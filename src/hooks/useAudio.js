import { useCallback, useEffect, useState } from "react";

export default function useAudio() {
  const soportado = typeof window !== "undefined" && "speechSynthesis" in window;
  const [hablando, setHablando] = useState(false);

  const detener = useCallback(() => {
    if (!soportado) return;
    window.speechSynthesis.cancel();
    setHablando(false);
  }, [soportado]);

  const leer = useCallback(
    (texto) => {
      if (!soportado || !texto) return;
      window.speechSynthesis.cancel();

      const voz = new SpeechSynthesisUtterance(texto);
      voz.lang = "es-ES";
      voz.rate = 0.9; // un poco más lento para niños
      voz.pitch = 1.1;

      // Intenta elegir una voz en español
      const voces = window.speechSynthesis.getVoices();
      const espanola =
        voces.find((v) => v.lang === "es-PE") ||
        voces.find((v) => v.lang === "es-MX") ||
        voces.find((v) => v.lang.startsWith("es"));
      if (espanola) voz.voice = espanola;

      voz.onstart = () => setHablando(true);
      voz.onend = () => setHablando(false);
      voz.onerror = () => setHablando(false);

      window.speechSynthesis.speak(voz);
    },
    [soportado]
  );

  // Detener al salir del componente
  useEffect(() => detener, [detener]);

  return { leer, detener, hablando, soportado };
}