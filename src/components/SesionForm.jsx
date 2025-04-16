import { useState } from "react";

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const UBICACIONES = ["Home", "Office", "School"];

export default function SesionForm({ comportamiento, onRegistrarSesion }) {
  const [frecuencia, setFrecuencia] = useState([]);
  const [duracion, setDuracion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [ocurrencias, setOcurrencias] = useState("");
  const [nota, setNota] = useState("");

  const toggleDia = (dia) => {
    setFrecuencia((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const generarNota = (ocurrencias) => {
    // Simulación simple de nota basada en número
    const valor = parseInt(ocurrencias);
    if (isNaN(valor)) return "Nota inválida.";
    if (valor <= comportamiento.sto) {
      return `Excelente progreso. Ocurrencias dentro del objetivo establecido.`;
    } else if (valor <= comportamiento.baseLine) {
      return `Progreso aceptable. Aún no se ha alcanzado el STO.`;
    } else {
      return `Aumento de ocurrencias observado. Revisar intervención.`;
    }
  };

  const handleRegistrar = () => {
    if (!duracion || !ubicacion || !ocurrencias) return alert("Faltan datos.");
    const nuevaNota = generarNota(ocurrencias);
    const nuevaSesion = {
      fecha: new Date().toLocaleDateString(),
      ocurrencias: Number(ocurrencias),
      duracion,
      ubicacion,
      nota: nuevaNota,
    };
    onRegistrarSesion(nuevaSesion);
    setNota(nuevaNota);
    setOcurrencias("");
  };

  return (
    <div className="border mt-4 p-3 rounded bg-white">
      <h4 className="font-semibold mb-2">📅 Configurar Sesiones para: <strong>{comportamiento.nombre}</strong></h4>

      <div className="mb-2">
        <label className="block font-medium mb-1">Días de sesión:</label>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => (
            <label key={dia} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={frecuencia.includes(dia)}
                onChange={() => toggleDia(dia)}
              />
              {dia}
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-3">
        <div>
          <label className="block text-sm">Duración (min)</label>
          <input
            type="number"
            className="border px-2 py-1 w-24"
            value={duracion}
            onChange={(e) => setDuracion(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm">Ubicación</label>
          <select
            className="border px-2 py-1"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {UBICACIONES.map((ubi) => (
              <option key={ubi} value={ubi}>
                {ubi}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm">Ocurrencias</label>
          <input
            type="number"
            className="border px-2 py-1 w-24"
            value={ocurrencias}
            onChange={(e) => setOcurrencias(e.target.value)}
          />
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mt-5"
          onClick={handleRegistrar}
        >
          Registrar sesión
        </button>
      </div>

      {nota && (
        <div className="mt-3 bg-gray-100 p-2 rounded text-sm">
          <strong>📝 Nota generada:</strong> {nota}
        </div>
      )}
    </div>
  );
}
