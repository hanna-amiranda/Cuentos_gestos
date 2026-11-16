import { useState } from "react";

export default function Pregunta({ escena, onElegir, onRetro }) {
  const [elegida, setElegida] = useState(null);

  const manejarClic = (opcion) => {
    if (elegida) return;
    if (opcion.retro) {
      setElegida(opcion);
      if (onRetro) onRetro(opcion.retro);
    } else {
      onElegir(opcion);
    }
  };

  return (
    <div>
      {escena.opciones.map((op, i) => {
        let clase = "boton-grande";
        if (elegida === op) clase += op.buena ? " buena" : " mala";
        return (
          <button key={i} className={clase} onClick={() => manejarClic(op)}>
            {op.texto}
          </button>
        );
      })}

      {elegida && (
        <>
          <div className="retro">
            {elegida.buena ? "✅ " : "💡 "}
            {elegida.retro}
          </div>
          <button className="boton-grande principal" onClick={() => onElegir(elegida)}>
            Continuar ➡️
          </button>
        </>
      )}
    </div>
  );
}