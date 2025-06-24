import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function DetallePaciente() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState('datasheets');

  useEffect(() => {
    // Lógica para obtener los datos del paciente desde el backend
    // Por ejemplo:
    // fetch(`http://localhost:5000/api/pacientes/${id}`)
    //   .then(response => response.json())
    //   .then(data => setPaciente(data));
  }, [id]);

  if (!paciente) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <header>
        <img src={paciente.fotoUrl} alt={`Foto de ${paciente.nombre}`} />
        <h1>{paciente.nombre}</h1>
      </header>
      <nav>
        <button onClick={() => setSeccionActiva('datasheets')}>📋 Datasheets</button>
        <button onClick={() => setSeccionActiva('charts')}>📊 Charts</button>
        <button onClick={() => setSeccionActiva('notes')}>📝 Notes</button>
      </nav>
      <main>
        {seccionActiva === 'datasheets' && (
          <div>
            {/* Componente o lógica para mostrar las datasheets */}
          </div>
        )}
        {seccionActiva === 'charts' && (
          <div>
            {/* Componente o lógica para mostrar los gráficos */}
          </div>
        )}
        {seccionActiva === 'notes' && (
          <div>
            {/* Componente o lógica para mostrar las notas */}
          </div>
        )}
      </main>
      <footer>
        <p>Nota legal: [Texto de la nota legal]</p>
      </footer>
    </div>
  );
}

export default DetallePaciente;
