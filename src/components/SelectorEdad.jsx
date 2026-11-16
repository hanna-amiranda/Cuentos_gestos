export default function SelectorEdad({ onElegir, onProbar }) {
  return (
    <div>
      <h1>📚 ¡Hola! ¿Cuántos años tienes?</h1>
      <div className="grid">
        <button className="tarjeta" onClick={() => onElegir("6-8")}>
          <span className="emoji">🧒</span>
          <span className="titulo">6 a 8 años</span>
        </button>
        <button className="tarjeta" onClick={() => onElegir("9-12")}>
          <span className="emoji">🧑‍🎓</span>
          <span className="titulo">9 a 12 años</span>
        </button>
      </div>
      <button className="boton-chico boton-prueba" onClick={onProbar}>
        🖐️ Probar gestos
      </button>
    </div>
  );
}