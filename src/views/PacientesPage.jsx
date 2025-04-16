import { useEffect, useState } from "react";
import PacienteForm from "../components/PacienteForm";
import PacienteCard from "../components/PacienteCard";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState([]);

  // Cargar pacientes al inicio
  const obtenerPacientes = async () => {
    const res = await fetch("http://localhost:5000/api/pacientes");
    const data = await res.json();
    setPacientes(data);
  };

  useEffect(() => {
    obtenerPacientes();
  }, []);

  // Crear paciente desde formulario
  const crearPaciente = async (paciente) => {
    const res = await fetch("http://localhost:5000/api/pacientes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paciente)
    });

    if (res.ok) {
      obtenerPacientes(); // actualiza lista
    }
  };

  // eliminar paciente desde formulario
  const eliminarPaciente = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/pacientes/${id}`, {
        method: "DELETE",
      });
  
      if (res.ok) {
        obtenerPacientes(); // refresca la lista
      }
    } catch (err) {
      console.error("Error al eliminar paciente:", err);
    }
  };
  

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">📊 Registro Semanal de Pacientes</h1>
      <PacienteForm onCrearPaciente={crearPaciente} />
      {pacientes.length === 0 ? (
        <p className="text-center">No hay pacientes aún.</p>
      ) : (
        pacientes.map((p) => (
          <PacienteCard key={p._id}
           paciente={p} 
           onEliminar={eliminarPaciente}/>
        ))
      )}
    </div>
  );
}
