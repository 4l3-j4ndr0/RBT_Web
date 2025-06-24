import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Importa tus imágenes locales
import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.png";
import avatar3 from "../assets/avatars/avatar3.png";
import avatar4 from "../assets/avatars/avatar4.png";
// import avatar5 from "../public/avatars/avatar5.png";
// import avatar6 from "../public/avatars/avatar6.png";
// import avatar7 from "../public/avatars/avatar7.png";

const avatars = [avatar1, avatar2, avatar3, avatar4];

export default function ClienteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/pacientes/${id}`)
      .then((res) => res.json())
      .then((data) => setCliente(data));
  }, [id]);

  if (!cliente) return <div className="text-center p-4">Cargando cliente...</div>;

  const avatarIndex = cliente.index || 0;
  const avatar = avatars[avatarIndex % avatars.length]; // Evita errores de índice

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        className="mb-4 text-blue-600 hover:underline"
        onClick={() => navigate("/")}
      >
        ← Volver a la lista de clientes
      </button>

      <div className="flex flex-col items-center mb-6">
        <img src={avatar} alt={`Avatar cliente ${cliente.nombre}`} className="w-32 h-32 mb-2" />
        <h1 className="text-2xl font-bold mb-1">{cliente.nombre || "Cliente"}</h1>
        <p className="text-gray-500">{cliente.edad} años</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <button
          className="bg-blue-100 hover:bg-blue-200 p-4 rounded shadow"
          onClick={() => navigate(`/clientes/${id}/datasheets`)}
        >
          Datasheets
        </button>
        <button
          className="bg-green-100 hover:bg-green-200 p-4 rounded shadow"
          onClick={() => navigate(`/clientes/${id}/charts`)}
        >
          Charts
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 p-4 rounded shadow"
          onClick={() => navigate(`/clientes/${id}/notes`)}
        >
          Notes
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Comportamientos asignados:</h2>
        <ul className="list-disc list-inside">
          {cliente.comportamientos?.map((c, i) => (
            <li key={i}>{c.nombre}</li>
          ))}
        </ul>
      </div>

      <details className="bg-gray-100 p-4 rounded shadow">
        <summary className="font-semibold cursor-pointer">Notes</summary>
        <p className="text-sm mt-2 text-gray-700">
          Recordatorio de que toda esta información es parte de una simulación con fines educativos.
          No es válida para usarse en entornos reales ni debe considerarse clínicamente precisa.
        </p>
      </details>
    </div>
  );
}
