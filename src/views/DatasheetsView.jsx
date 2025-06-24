import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DatasheetsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [datasheets, setDatasheets] = useState([]);

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  useEffect(() => {
    const obtenerCliente = async () => {
      const res = await fetch(`http://localhost:5000/api/pacientes/${id}`);
      const data = await res.json();
      setCliente(data);
    };

    const obtenerDatasheets = async () => {
      const res = await fetch(`http://localhost:5000/api/pacientes/${id}/datasheets`);
      const data = await res.json();
      setDatasheets(data);
    };

    obtenerCliente();
    obtenerDatasheets();
  }, [id]);

  if (!cliente) return <div className="p-4 text-center">Cargando cliente...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="print:hidden text-sm text-gray-500 mb-2">
        CLIENTES &gt; {cliente.nombre} &gt; <span className="font-medium text-black">Datasheets</span>
      </div>

      <button
        className="mb-4 text-blue-600 hover:underline print:hidden"
        onClick={() => navigate(`/clientes/${id}`)}
      >
        ← Volver al cliente
      </button>

      <h1 className="text-2xl font-bold mb-4">Datasheets de {cliente.nombre}</h1>

      {datasheets.length === 0 ? (
        <p>No hay datos para mostrar.</p>
      ) : (
        datasheets.map((comp, idx) => (
          <div key={idx} className="mb-10 border border-gray-300 rounded overflow-auto">
            <div className="bg-gray-100 p-4">
              <h2 className="text-lg font-semibold">{comp.nombre}</h2>
              <p className="text-sm text-gray-700 mb-1">{comp.descripcion}</p>
              <p className="text-sm text-gray-500">STO actual: {comp.sto}</p>
            </div>

            <table className="w-full text-center border-t">
              <thead className="bg-gray-200">
                <tr>
                  {diasSemana.map((dia, i) => (
                    <th key={i} className="py-2 px-3 border">{dia}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {comp.semana.map((valor, i) => (
                    <td key={i} className="py-2 px-3 border">{valor !== null ? valor : "-"}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ))
      )}

      <div className="print:hidden">
        <button
          onClick={() => window.print()}
          className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Descargar en formato DOC
        </button>
      </div>
    </div>
  );
}
