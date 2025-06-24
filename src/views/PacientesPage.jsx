import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NuevoClienteModal from "../components/NuevoClienteModal";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();

  const obtenerPacientes = async () => {
    const res = await fetch("http://localhost:5000/api/pacientes");
    const data = await res.json();
    setPacientes(data);
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👦 Clientes</h1>
        <button
          onClick={() => setModalAbierto(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Nuevo cliente
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pacientes.map((p, i) => (
          <div
            key={p._id}
            onClick={() => navigate(`/clientes/${p._id}`)}
            className="cursor-pointer bg-white shadow-md hover:shadow-lg transition border border-gray-200 rounded p-4 text-center"
          >
            <img
              src={`/avatars/avatar${(i % 7) + 1}.png`}
              alt={`Avatar de ${p.identificador}`}
              className="w-24 h-24 mx-auto mb-2"
            />
            <h2 className="font-semibold text-lg">Cliente {i + 1}</h2>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <NuevoClienteModal
          onClose={() => setModalAbierto(false)}
          onClienteGuardado={() => {
            setModalAbierto(false);
            obtenerPacientes(); // Refresca la lista
          }}
        />
      )}
    </div>
  );
}
