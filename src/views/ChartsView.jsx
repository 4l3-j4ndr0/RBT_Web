import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";

export default function ChartsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      const res = await fetch(`http://localhost:5000/api/pacientes/${id}`);
      const data = await res.json();
      setCliente(data);
    };
    fetchCliente();
  }, [id]);

  if (!cliente) return <div className="p-4 text-center">Cargando cliente...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="print:hidden text-sm text-gray-500 mb-2">
        CLIENTES &gt; {cliente.nombre} &gt; <span className="font-medium text-black">Charts</span>
      </div>

      <button
        className="mb-4 text-blue-600 hover:underline print:hidden"
        onClick={() => navigate(`/clientes/${id}`)}
      >
        ← Volver al cliente
      </button>

      <div className="flex justify-end print:hidden">
        <button
          onClick={() => window.print()}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2m-4 0h-4v4h4v-4z" />
          </svg>
          Print
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Gráficas de {cliente.nombre}</h1>

      {cliente.comportamientos?.map((comp, i) => {
        const data = comp.data.map((item) => ({
          fecha: new Date(item.fecha).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" }),
          valor: item.valor,
        }));

        return (
          <div key={i} className="mb-12">
            <h2 className="text-lg font-semibold mb-2">{comp.nombre}</h2>
            <p className="text-sm text-gray-700 mb-1">{comp.descripcion}</p>
            <p className="text-sm text-gray-500 mb-4">STO: {comp.sto} | Baseline: {comp.baseline}</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="valor" stroke="#1f2937" name="Total" />
                <ReferenceLine y={comp.baseline} label="Baseline" stroke="red" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}
