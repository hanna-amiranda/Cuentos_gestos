import { useState } from "react";
import SelectorEdad from "./components/SelectorEdad";
import Biblioteca from "./components/Biblioteca";
import PreguntaAudio from "./components/PreguntaAudio";
import LectorEscena from "./components/LectorEscena";
import { cuentosPorEdad } from "./data/cuentos";
import PruebaGestos from "./components/PruebaGestos";

export default function App() {
  const [pantalla, setPantalla] = useState("edad");
  const [edad, setEdad] = useState(null);
  const [cuento, setCuento] = useState(null);
  const [conAudio, setConAudio] = useState(false);

  if (pantalla === "prueba") {
    return <PruebaGestos onVolver={() => setPantalla("edad")} />;
  }

  if (pantalla === "edad") {
    return (
      <SelectorEdad
        onProbar={() => setPantalla("prueba")}
        onElegir={(rango) => {
          setEdad(rango);
          setPantalla("biblioteca");
        }}
      />
    );
  }

  if (pantalla === "biblioteca") {
    return (
      <Biblioteca
        cuentos={cuentosPorEdad(edad)}
        onVolver={() => setPantalla("edad")}
        onElegir={(c) => {
          setCuento(c);
          setPantalla("audio");
        }}
      />
    );
  }

  if (pantalla === "audio") {
    return (
      <PreguntaAudio
        cuento={cuento}
        onVolver={() => setPantalla("biblioteca")}
        onElegir={(si) => {
          setConAudio(si);
          setPantalla("lector");
        }}
      />
    );
  }

  return (
    <LectorEscena
      cuento={cuento}
      conAudio={conAudio}
      onSalir={() => setPantalla("biblioteca")}
    />
  );
}