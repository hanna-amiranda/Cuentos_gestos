import { useState } from "react";
import useGestos from "../hooks/useGestos";
import PermisoCamara from "./PermisoCamara";

export default function PruebaGestos({ onVolver }) {
  const [acepto, setAcepto] = useState(false);
  const { videoRef, estado, error, puntero, iniciar, detener } = useGestos();

  const aceptar = () => {
    setAcepto(true);
    iniciar();
  };

  const salir = () => {
    detener();
    onVolver();
  };

  return (
    <div>
      <button className="boton-volver" onClick={salir}>← Volver</button>
      <h1>🖐️ Prueba de gestos</h1>

      {(!acepto || estado === "error") && (
        <PermisoCamara onAceptar={aceptar} onCancelar={salir} error={error} />
      )}

      {estado === "cargando" && <p className="texto">Cargando… ⏳</p>}

      <div className="camara" style={{ display: estado === "activo" ? "block" : "none" }}>
        <video ref={videoRef} playsInline muted />
        {puntero && (
          <div
            className="punto-mano"
            style={{ left: `${puntero.x * 100}%`, top: `${puntero.y * 100}%` }}
          />
        )}
      </div>

      {estado === "activo" && (
        <p className="texto">
          {puntero ? "✅ ¡Te veo! Mueve tu dedo índice." : "🔍 Muestra tu mano a la cámara."}
        </p>
      )}
    </div>
  );
}