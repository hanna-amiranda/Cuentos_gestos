import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

function obtenerAnonId() {
  try {
    let id = localStorage.getItem("anon_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("anon_id", id);
    }
    return id;
  } catch {
    return "sin-id";
  }
}

export async function guardarProgreso({ cuentoId, edad, buenas, total }) {
  if (!db) return;
  try {
    await addDoc(collection(db, "progreso"), {
      anonId: obtenerAnonId(),
      cuentoId,
      edad,
      buenas,
      total,
      creadoEn: serverTimestamp(),
    });
  } catch (e) {
    console.error("No se pudo guardar el progreso:", e.message);
  }
}