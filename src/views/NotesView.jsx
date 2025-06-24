import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function NotesView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    const fetchCliente = async () => {
      const res = await fetch(`http://localhost:5000/api/pacientes/${id}`);
      const data = await res.json();
      setCliente(data);
      const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
      const generadas = [];
      data.comportamientos?.forEach((comp) => {
        comp.data.forEach((entry) => {
          const dia = new Date(entry.fecha).getDay();
          generadas.push({
            fecha: entry.fecha,
            diaSemana: dias[dia === 0 ? 6 : dia - 1],
            resumen: `Durante la sesión del día ${dias[dia === 0 ? 6 : dia - 1]} (${entry.fecha}), el comportamiento "${comp.nombre}" se registró con un valor de ${entry.valor}.`,
          });
        });
      });
      setNotas(generadas);
    };
    fetchCliente();
  }, [id]);

  if (!cliente) return <div className="p-4 text-center">Cargando cliente...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="print:hidden text-sm text-gray-500 mb-2">
        CLIENTES &gt; {cliente.nombre} &gt; <span className="font-medium text-black">Notes</span>
      </div>

      <button
        className="mb-4 text-blue-600 hover:underline print:hidden"
        onClick={() => navigate(`/clientes/${id}`)}
      >
        ← Volver al cliente
      </button>

      <h1 className="text-2xl font-bold mb-6">Notas de {cliente.nombre}</h1>

      {notas.length === 0 ? (
        <p>No hay notas generadas.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notas.map((nota, i) => (
            <Link to={`/clientes/${id}/notes/${nota.fecha}`} key={i}>
              <div className="border p-4 rounded shadow bg-white hover:bg-gray-50 transition">
                <h3 className="text-sm font-semibold mb-1">{nota.diaSemana}, {nota.fecha}</h3>
                <p className="text-sm text-gray-700">{nota.resumen}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
