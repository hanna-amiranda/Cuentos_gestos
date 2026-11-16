import { useEffect, useRef, useState } from "react";
import useGestos from "../hooks/useGestos";
import PermisoCamara from "./PermisoCamara";

const TIEMPO = 1500; // milisegundos para "hacer clic"
const clamp = (v) => Math.min(1, Math.max(0, v));

export default function GestosGlobal() {
  const { videoRef, estado, error, puntero, iniciar, detener } = useGestos();
  const [pidiendo, setPidiendo] = useState(false);
  const [pos, setPos] = useState(null);
  const [progreso, setProgreso] = useState(0);

  const suave = useRef(null);
  const objetivo = useRef(null);
  const inicio = useRef(0);
  const enfriar = useRef(0);

  useEffect(() => {
    const limpiar = () => {
      objetivo.current?.classList.remove("gesto-objetivo");
      objetivo.current = null;
      setProgreso(0);
    };

    if (!puntero) {
      suave.current = null;
      setPos(null);
      limpiar();
      return;
    }

    // Usa solo el centro de la cámara para poder llegar a los bordes
    const x = clamp((puntero.x - 0.1) / 0.8);
    const y = clamp((puntero.y - 0.1) / 0.8);

    // Suavizado para que el círculo no tiemble
    const s = suave.current ?? { x, y };
    s.x += (x - s.x) * 0.35;
    s.y += (y - s.y) * 0.35;
    suave.current = s;
    setPos({ x: s.x, y: s.y });

    // Bordes: desplazar la página
    if (s.y < 0.06) { window.scrollBy(0, -14); limpiar(); return; }
    if (s.y > 0.94) { window.scrollBy(0, 14); limpiar(); return; }

    const ahora = performance.now();
    const el = document.elementFromPoint(s.x * window.innerWidth, s.y * window.innerHeight);
    const boton = el?.closest("button");

    if (!boton || boton.disabled || ahora < enfriar.current) {
      limpiar();
      return;
    }

    if (boton !== objetivo.current) {
      limpiar();
      objetivo.current = boton;
      inicio.current = ahora;
      boton.classList.add("gesto-objetivo");
      return;
    }

    const p = (ahora - inicio.current) / TIEMPO;
    if (p >= 1) {
      boton.click();
      enfriar.current = ahora + 1200; // pausa para no repetir el clic
      limpiar();
    } else {
      setProgreso(p);
    }
  }, [puntero]);

  const aceptar = () => {
    setPidiendo(false);
    iniciar();
  };

  const apagar = () => {
    detener();
    setPidiendo(false);
  };

  const activo = estado === "activo";

  return (
    <>
      {/* Mini cámara */}
      <div className="mini-camara" style={{ display: activo ? "block" : "none" }}>
        <video ref={videoRef} playsInline muted />
      </div>

      {/* Botón flotante */}
      {activo ? (
        <button className="boton-chico gesto-flotante" onClick={apagar}>
          ⏹️ Apagar cámara
        </button>
      ) : (
        estado !== "cargando" && (
          <button className="boton-chico gesto-flotante" onClick={() => setPidiendo(true)}>
            🖐️ Activar gestos
          </button>
        )
      )}

      {estado === "cargando" && <div className="gesto-flotante cargando">Cargando… ⏳</div>}

      {/* Ventana de permiso */}
      {(pidiendo || estado === "error") && (
        <div className="fondo-permiso">
          <div className="caja-permiso">
            <PermisoCamara onAceptar={aceptar} onCancelar={apagar} error={error} />
          </div>
        </div>
      )}

      {/* Círculo que sigue el dedo */}
      {pos && (
        <div
          className="cursor-mano"
          style={{ left: `${pos.x * 100}vw`, top: `${pos.y * 100}vh` }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="22" className="anillo-fondo" />
            <circle
              cx="32" cy="32" r="22"
              className="anillo-progreso"
              strokeDasharray={138.2}
              strokeDashoffset={138.2 * (1 - progreso)}
              transform="rotate(-90 32 32)"
            />
            <circle cx="32" cy="32" r="6" className="centro-cursor" />
          </svg>
        </div>
      )}
    </>
  );
}