export default function Biblioteca({ cuentos, onElegir, onVolver }) {
  return (
    <div>
      <button className="boton-volver" onClick={onVolver}>← Cambiar edad</button>
      <h1>📖 Elige tu cuento</h1>
      <div className="grid">
        {cuentos.map((c) => (
          <button key={c.id} className="tarjeta" onClick={() => onElegir(c)}>
            <span className="emoji">{c.emoji}</span>
            <span className="titulo">{c.titulo}</span>
            <span className="sub">{c.escenas.length} escenas</span>
          </button>
        ))}
      </div>
    </div>
  );
}