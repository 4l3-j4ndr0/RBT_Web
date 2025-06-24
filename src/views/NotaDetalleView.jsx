import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotaDetalleView() {
  const { id, fecha } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [nota, setNota] = useState(null);

  useEffect(() => {
    const obtenerNota = async () => {
      const res = await fetch(`http://localhost:5000/api/pacientes/${id}`);
      const data = await res.json();
      setCliente(data);

      const comportamientosDelDia = [];

      data.comportamientos?.forEach((comp) => {
        comp.data?.forEach((registro) => {
          if (registro.fecha === fecha) {
            comportamientosDelDia.push({
              nombre: comp.nombre,
              descripcion: comp.descripcion,
              valor: registro.valor,
            });
          }
        });
      });

      const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
      const dateObj = new Date(fecha);
      const diaSemana = dias[dateObj.getDay()];

      setNota({
        fecha,
        diaSemana,
        comportamientos: comportamientosDelDia,
      });
    };

    obtenerNota();
  }, [id, fecha]);

  if (!cliente || !nota) return <div className="p-6 text-center">Cargando nota...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb y botón de volver (ocultos al imprimir) */}
      <div className="print:hidden text-sm text-gray-500 mb-2">
        CLIENTES &gt; {cliente.nombre} &gt; Notas &gt; <span className="font-medium text-black">{nota.fecha}</span>
      </div>

      <button
        onClick={() => navigate(`/clientes/${id}/notes`)}
        className="text-blue-600 mb-6 hover:underline print:hidden"
      >
        ← Volver a notas
      </button>

      {/* Contenido principal */}
      <h1 className="text-2xl font-bold mb-4">Nota clínica del RBT</h1>

      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2 text-sm text-gray-600">
          <strong>Fecha:</strong> {nota.fecha} ({nota.diaSemana})
        </p>

        <p className="text-gray-800 leading-relaxed">
          Durante la sesión realizada el <strong>{nota.diaSemana}</strong>, el RBT trabajó con el cliente{" "}
          <strong>{cliente.nombre}</strong>. La sesión incluyó observación directa de los siguientes comportamientos:
        </p>

        <ul className="mt-4 list-disc list-inside text-gray-700">
          {nota.comportamientos.map((c, i) => (
            <li key={i}>
              <strong>{c.nombre}:</strong> {c.descripcion} (valor registrado: {c.valor})
            </li>
          ))}
        </ul>

        <p className="mt-6 text-gray-800 leading-relaxed">
          El RBT implementó procedimientos establecidos y mantuvo una actitud profesional durante toda la intervención.
          No se reportaron incidentes significativos fuera de los comportamientos registrados. Se continuará dando
          seguimiento al progreso del cliente en futuras sesiones.
        </p>
      </div>
    </div>
  );
}
