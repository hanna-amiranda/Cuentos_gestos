export default function PreguntaAudio({ cuento, onElegir, onVolver }) {
  return (
    <div>
      <button className="boton-volver" onClick={onVolver}>← Volver a la biblioteca</button>
      <h1>{cuento.emoji} {cuento.titulo}</h1>
      <div className="escena">
        <div className="emoji-grande">🔊</div>
        <p className="texto">¿Quieres escuchar el cuento?</p>
        <button className="boton-grande principal" onClick={() => onElegir(true)}>
          🔊 Sí, léemelo
        </button>
        <button className="boton-grande" onClick={() => onElegir(false)}>
          🔇 No, lo leo yo
        </button>
      </div>
    </div>
  );
}