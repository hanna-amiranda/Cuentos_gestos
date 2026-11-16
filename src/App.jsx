import { useState } from "react";
import SelectorEdad from "./components/SelectorEdad";
import Biblioteca from "./components/Biblioteca";
import PreguntaAudio from "./components/PreguntaAudio";
import LectorEscena from "./components/LectorEscena";
import GestosGlobal from "./components/GestosGlobal";
import { cuentosPorEdad } from "./data/cuentos";

export default function App() {
  const [pantalla, setPantalla] = useState("edad");
  const [edad, setEdad] = useState(null);
  const [cuento, setCuento] = useState(null);
  const [conAudio, setConAudio] = useState(false);

  let contenido;

  if (pantalla === "edad") {
    contenido = (
      <SelectorEdad
        onElegir={(rango) => {
          setEdad(rango);
          setPantalla("biblioteca");
        }}
      />
    );
  } else if (pantalla === "biblioteca") {
    contenido = (
      <Biblioteca
        cuentos={cuentosPorEdad(edad)}
        onVolver={() => setPantalla("edad")}
        onElegir={(c) => {
          setCuento(c);
          setPantalla("audio");
        }}
      />
    );
  } else if (pantalla === "audio") {
    contenido = (
      <PreguntaAudio
        cuento={cuento}
        onVolver={() => setPantalla("biblioteca")}
        onElegir={(si) => {
          setConAudio(si);
          setPantalla("lector");
        }}
      />
    );
  } else {
    contenido = (
      <LectorEscena
        cuento={cuento}
        conAudio={conAudio}
        onSalir={() => setPantalla("biblioteca")}
      />
    );
  }

  return (
    <>
      {contenido}
      <GestosGlobal />
    </>
  );
}