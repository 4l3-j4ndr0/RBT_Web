import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function PacienteCard({ paciente, onEliminar }) {
  const [notaIA, setNotaIA] = useState("");
  const [generando, setGenerando] = useState(false);
  const navigate = useNavigate();

  

  const generarNotaConIA = async () => {
    const prompt = `Actúa como un RBT experimentado. Se han registrado estas ocurrencias de conducta en la semana del paciente ${paciente.identificador}: ${paciente.data.map(d => `${d.day}: ${d.value}`).join(", ")}. Redacta una nota clínica clara, profesional y coherente sobre el progreso observado.`;

    setGenerando(true);
    setNotaIA("Generando...");

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.6,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setNotaIA(res.data.choices[0].message.content);
    } catch (error) {
      console.error("Error generando nota:", error);
      setNotaIA("❌ Error generando nota clínica.");
    }

    setGenerando(false);
  };

  return (
    <div
  className="bg-white shadow rounded p-4 mb-6 border border-gray-200 cursor-pointer hover:shadow-lg transition"
  onClick={() => navigate(`/paciente/${paciente._id}`)}
>

      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-blue-900">
          🧑 Paciente: {paciente.identificador}
        </h2>
        <button
  onClick={(e) => {
    e.stopPropagation(); // ❌ evita que se dispare el click del div padre
    onEliminar(paciente._id);
  }}
  className="text-red-600 hover:text-red-800 font-bold text-sm"
>
  ❌ Eliminar
</button>

      </div>

      <div className="mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={paciente.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#1e40af" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-gray-700 mb-2">
        <strong>Nota manual:</strong> {paciente.nota}
      </p>

      <div className="text-center mb-4">
        <button
          onClick={generarNotaConIA}
          disabled={generando}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          {generando ? "Generando..." : "🧠 Generar Nota con IA"}
        </button>
      </div>

      {notaIA && (
        <div className="bg-gray-100 border border-gray-300 rounded p-3 text-sm text-gray-800 whitespace-pre-wrap">
          <strong>Nota generada con IA:</strong><br />
          {notaIA}
        </div>
      )}
    </div>
  );
}
