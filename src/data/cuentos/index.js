import cuento1 from "./cuento1.json";
import cuento2 from "./cuento2.json";
import cuento3 from "./cuento3.json";
import cuento4 from "./cuento4.json";

export const cuentos = [cuento1, cuento2, cuento3, cuento4];

export const cuentosPorEdad = (rango) =>
  cuentos.filter((c) => c.edad === rango);