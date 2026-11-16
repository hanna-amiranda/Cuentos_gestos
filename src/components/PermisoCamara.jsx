export default function PermisoCamara({ onAceptar, onCancelar, error }) {
  return (
    <div className="escena">
      <div className="emoji-grande">📷</div>
      <p className="texto">
        Para mover los cuentos con tu mano, necesitamos usar la cámara.
      </p>
      <div className="retro">
        🔒 <strong>Tu privacidad:</strong> el video se procesa solo en este
        dispositivo. No se graba, no se guarda y no se envía a internet.
      </div>
      <p>👨‍👩‍👧 Si eres menor, pide permiso a un adulto antes de continuar.</p>
      {error && <div className="retro">⚠️ {error}</div>}
      <button className="boton-grande principal" onClick={onAceptar}>
        ✅ Activar cámara
      </button>
      <button className="boton-grande" onClick={onCancelar}>
        🖱️ Mejor uso el mouse o el dedo
      </button>
    </div>
  );
}