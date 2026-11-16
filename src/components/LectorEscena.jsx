import { useEffect, useRef, useState } from "react";
import { guardarProgreso } from "../lib/progreso";
import Pregunta from "./Pregunta";
import useAudio from "../hooks/useAudio";

export default function LectorEscena({ cuento, conAudio, onSalir }) {
  const [escenaId, setEscenaId] = useState(cuento.escenas[0].id);
  const [buenas, setBuenas] = useState(0);
  const [total, setTotal] = useState(0);
  const [audioActivo, setAudioActivo] = useState(conAudio);
  const { leer, detener, hablando, soportado } = useAudio();

  const escena = cuento.escenas.find((e) => e.id === escenaId);

  const guardado = useRef(false);

  useEffect(() => {
    if (escena.tipo === "fin" && !guardado.current) {
      guardado.current = true;
      guardarProgreso({
        cuentoId: cuento.id,
        edad: cuento.edad,
        buenas,
        total,
      });
    }
  }, [escena.tipo]); // eslint-disable-line react-hooks/exhaustive-deps
  // Lee la escena automáticamente cuando cambia
  useEffect(() => {
    if (!audioActivo) return;
    let texto = escena.texto;
    if (escena.tipo === "decision") {
      texto += ". " + escena.opciones.map((o, i) => `Opción ${i + 1}: ${o.texto}`).join(". ");
    }
    if (escena.tipo === "fin") {
      texto += ". Aprendimos: " + escena.aprendizaje;
    }
    leer(texto);
  }, [escenaId, audioActivo]); // eslint-disable-line react-hooks/exhaustive-deps

  const alternarAudio = () => {
    if (audioActivo) {
      detener();
      setAudioActivo(false);
    } else {
      setAudioActivo(true);
    }
  };

  const repetir = () => {
    let texto = escena.texto;
    if (escena.tipo === "decision") {
      texto += ". " + escena.opciones.map((o, i) => `Opción ${i + 1}: ${o.texto}`).join(". ");
    }
    if (escena.tipo === "fin") texto += ". Aprendimos: " + escena.aprendizaje;
    leer(texto);
  };

  const elegirOpcion = (opcion) => {
    detener();
    setTotal((t) => t + 1);
    if (opcion.buena) setBuenas((b) => b + 1);
    setEscenaId(opcion.siguiente);
  };

  const siguiente = (id) => {
    detener();
    setEscenaId(id);
  };

  const reiniciar = () => {
    detener();
    setEscenaId(cuento.escenas[0].id);
    setBuenas(0);
    setTotal(0);
  };

  const salir = () => {
    detener();
    onSalir();
  };

  return (
    <div>
      <button className="boton-volver" onClick={salir}>← Volver a la biblioteca</button>
      <h2>{cuento.titulo}</h2>

      {soportado && (
        <div className="barra-audio">
          <button className="boton-chico" onClick={alternarAudio}>
            {audioActivo ? "🔊 Audio: Sí" : "🔇 Audio: No"}
          </button>
          {audioActivo && (
            <>
              <button className="boton-chico" onClick={repetir}>🔁 Repetir</button>
              {hablando && <button className="boton-chico" onClick={detener}>⏸️ Parar</button>}
            </>
          )}
        </div>
      )}

      <div className="escena">
        <div className="emoji-grande">{escena.emoji}</div>
        <p className="texto">{escena.texto}</p>

        {escena.tipo === "narracion" && (
          <button className="boton-grande principal" onClick={() => siguiente(escena.siguiente)}>
            Siguiente ➡️
          </button>
        )}

        {escena.tipo === "decision" && (
          <Pregunta
            key={escena.id}
            escena={escena}
            onElegir={elegirOpcion}
            onRetro={(texto) => audioActivo && leer(texto)}
          />
        )}

        {escena.tipo === "fin" && (
          <>
            <div className="aprendizaje">🧠 <strong>Aprendimos:</strong> {escena.aprendizaje}</div>
            <p className="texto">Tomaste {buenas} buenas decisiones de {total} ⭐</p>
            <button className="boton-grande" onClick={reiniciar}>🔄 Leer otra vez</button>
            <button className="boton-grande principal" onClick={salir}>📚 Elegir otro cuento</button>
          </>
        )}
      </div>
    </div>
  );
}