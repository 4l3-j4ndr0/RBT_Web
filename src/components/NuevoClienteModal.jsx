import { useState } from "react";
import behaviorsData from "../data/aba_behaviors.json";
import avatar1 from "../assets/avatars/avatar1.png";
import avatar2 from "../assets/avatars/avatar2.png";
import avatar3 from "../assets/avatars/avatar3.png";
import avatar4 from "../assets/avatars/avatar4.png";

const avatars = [avatar1, avatar2, avatar3, avatar4];
const comportamientos = behaviorsData.behaviors;

const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default function NuevoClienteModal({ onClose, onClienteCreado }) {
  const [edadAnios, setEdadAnios] = useState("");
  const [edadMeses, setEdadMeses] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [filtro, setFiltro] = useState("");
  const [comportamientosSeleccionados, setComportamientosSeleccionados] = useState([]);
  const [autoGenerarCliente, setAutoGenerarCliente] = useState(false);
  const [valoresPorComportamiento, setValoresPorComportamiento] = useState({});
  const [erroresPorComportamiento, setErroresPorComportamiento] = useState({});
  const [errores, setErrores] = useState({});
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [infoSesiones, setInfoSesiones] = useState({});
  
  

 const toggleComportamiento = (nombre) => {
  setComportamientosSeleccionados((prev) => {
    const actualizados = prev.includes(nombre)
      ? prev.filter((n) => n !== nombre)
      : [...prev, nombre];

    if (!prev.includes(nombre)) {
      // ✅ Al seleccionar un nuevo comportamiento, limpiamos errores visuales
      setValoresPorComportamiento((prevValores) => ({
        ...prevValores,
        [nombre]: { baseline: "", sto: "" }
      }));

      setErroresPorComportamiento((prevErrores) => {
        const nuevosErrores = { ...prevErrores };
        delete nuevosErrores[nombre];
        return nuevosErrores;
      });
    } else {
      const nuevosValores = { ...valoresPorComportamiento };
      delete nuevosValores[nombre];
      setValoresPorComportamiento(nuevosValores);
    }

    return actualizados;
  });

  // ✅ Si había error global por no seleccionar ningún comportamiento, lo limpiamos si selecciona alguno
  setErrores((prevErrores) => {
    const nuevos = { ...prevErrores };
    delete nuevos.comportamientos;
    return nuevos;
  });
};


  const toggleDia = (dia) => {
  setDiasSeleccionados((prev) => {
    const nuevos = prev.includes(dia)
      ? prev.filter((d) => d !== dia)
      : [...prev, dia];

    // Elimina el error visual si al menos un día está seleccionado
    if (nuevos.length > 0) {
      setErrores((prevErrores) => {
        const { sesiones, ...resto } = prevErrores;
        return resto;
      });
    }

    return nuevos;
  });
};


  const actualizarInfoSesion = (dia, campo, valor) => {
  setInfoSesiones((prev) => {
    const nuevaInfo = {
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor
      }
    };

    // Validaciones en tiempo real
    setErrores((prevErrores) => {
      const nuevosErrores = { ...prevErrores };

      // Si el campo actualizado es "inicio" o "fin"
      if ((campo === "inicio" || campo === "fin") && nuevaInfo[dia]?.inicio && nuevaInfo[dia]?.fin) {
        delete nuevosErrores[`horario-${dia}`];
      }

      // Si el campo actualizado es "ubicacion" y tiene valor
      if (campo === "ubicacion" && valor !== "") {
        delete nuevosErrores[`ubicacion-${dia}`];
      }

      return nuevosErrores;
    });

    return nuevaInfo;
  });
};


  const generarRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const handleAutogenerarCliente = () => {
    if (autoGenerarCliente) {
      setAutoGenerarCliente(false);
      setEdadAnios("");
      setEdadMeses("");
      setAvatarIndex(0);
      setComportamientosSeleccionados([]);
    } else {
      setAutoGenerarCliente(true);
      if (Math.random() > 0.5) {
        setEdadAnios(generarRandom(1, 15).toString());
        setEdadMeses("");
      } else {
        setEdadMeses(generarRandom(1, 11).toString());
        setEdadAnios("");
      }
      setAvatarIndex(generarRandom(0, avatars.length - 1));
      const nombres = comportamientos.map((c) => c.name);
      const seleccionados = nombres.sort(() => 0.5 - Math.random()).slice(0, 3);
      setComportamientosSeleccionados(seleccionados);
      const nuevosValores = {};
      seleccionados.forEach((nombre) => {
        const baseline = generarRandom(20, 40);
        nuevosValores[nombre] = {
          baseline,
          sto: baseline - 5
        };
      });
      setValoresPorComportamiento(nuevosValores);
    }
  };

  const comportamientosFiltrados = comportamientos.filter(
    (comp) =>
      comp.name.toLowerCase().includes(filtro.toLowerCase()) ||
      comp.function.toLowerCase().includes(filtro.toLowerCase())
  );

  const comportamientosPorCategoria = comportamientosFiltrados.reduce((acc, c) => {
    if (!acc[c.category]) acc[c.category] = [];
    acc[c.category].push(c);
    return acc;
  }, {});

  const handleGuardar = async () => {
    const edadNum = parseInt(edadAnios, 10);
    const mesesNum = parseInt(edadMeses, 10);
    const nuevosErrores = {};

    // Validar que al menos un día de sesión esté seleccionado
if (diasSeleccionados.length === 0) {
  nuevosErrores.sesiones = "Debes seleccionar al menos un día de sesión.";
} else {
  for (const dia of diasSeleccionados) {
    const sesion = infoSesiones[dia] || {};
    if (!sesion.inicio || !sesion.fin) {
      nuevosErrores[`horario-${dia}`] = `Debes completar el horario de la sesión para ${dia}.`;
    }
    if (!sesion.ubicacion) {
      nuevosErrores[`ubicacion-${dia}`] = `Debes seleccionar la ubicación para ${dia}.`;
    }
  }
}


    if ((isNaN(edadNum) || edadNum <= 0 || edadNum > 50) && (isNaN(mesesNum) || mesesNum <= 0 || mesesNum > 12)) {
      nuevosErrores.edad = true;
    }

    if (comportamientosSeleccionados.length === 0) {
      nuevosErrores.comportamientos = true;
    }

    const nuevosErroresPorComportamiento = {};

comportamientosSeleccionados.forEach((nombre) => {
  const valores = valoresPorComportamiento[nombre] || {};
  const baseline = parseInt(valores.baseline, 10);
  const sto = parseInt(valores.sto, 10);

  const baselineError = isNaN(baseline) || baseline <= 0;
  const stoError = isNaN(sto) || sto !== baseline - 5;

  if (baselineError || stoError) {
    nuevosErroresPorComportamiento[nombre] = {
      baseline: baselineError,
      sto: stoError
    };
  }
});

setErroresPorComportamiento(nuevosErroresPorComportamiento);

if (Object.keys(nuevosErroresPorComportamiento).length > 0) {
  alert("Revisa los campos de baseline y STO. Algunos valores no cumplen las condiciones.");
  return;
}


   
    setErrores(nuevosErrores);
if (Object.keys(nuevosErrores).length > 0) {
  alert("Corrige los errores antes de guardar.");
  return;
}

    for (const nombre of comportamientosSeleccionados) {
  const valores = valoresPorComportamiento[nombre];
  const baseline = parseInt(valores?.baseline, 10);
  const sto = parseInt(valores?.sto, 10);
  const errores = {
    baseline: isNaN(baseline) || baseline <= 0,
    sto: isNaN(sto) || sto !== baseline - 5
  };
  if (errores.baseline || errores.sto) {
    setErroresPorComportamiento((prev) => ({
      ...prev,
      [nombre]: errores
    }));
    alert("Revisa los campos de baseline y STO. Algunos valores no cumplen las condiciones.");
    return;
  }
}


    const nuevoPaciente = {
      identificador: "",
      nombre: `Cliente`,
      edad: isNaN(edadNum) ? 0 : edadNum,
      meses: isNaN(mesesNum) ? 0 : mesesNum,
      index: avatarIndex,
      comportamientos: comportamientosSeleccionados.map((nombre) => {
        const encontrado = comportamientos.find((c) => c.name === nombre);
        const valores = valoresPorComportamiento[nombre] || {};
        const baseline = autoGenerarCliente ? generarRandom(20, 40) : parseInt(valores.baseline, 10);
        const sto = autoGenerarCliente ? baseline - 5 : parseInt(valores.sto, 10);

        return {
          nombre,
          descripcion: encontrado?.descripcion || "",
          baseline: isNaN(baseline) ? 0 : baseline,
          sto: isNaN(sto) ? 0 : sto,
          data: []
        };
      })
    };

    const res = await fetch("http://localhost:5000/api/pacientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPaciente)
    });

    if (res.ok) {
      onClienteCreado();
      onClose();
    } else {
      alert("Error al guardar el paciente.");
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-lg overflow-y-auto max-h-[95vh]">
        <h2 className="text-xl font-bold mb-4">Nuevo Cliente</h2>

        <div className="flex justify-between items-center mb-4">
          <label className="text-sm font-medium">Autogenerar cliente:</label>
          <input
            type="checkbox"
            checked={autoGenerarCliente}
            onChange={handleAutogenerarCliente}
          />
        </div>

        <label className="block mb-2 text-sm font-medium">Edad (años):</label>
        <input
  type="text"
  placeholder="0"
  value={edadAnios}
  onChange={(e) => {
    const valor = e.target.value;
    setEdadAnios(valor);

    // Validación automática
    const numero = parseInt(valor, 10);
    const mesesNum = parseInt(edadMeses, 10);
    const error =
      (isNaN(numero) || numero <= 0 || numero > 50) &&
      (isNaN(mesesNum) || mesesNum <= 0 || mesesNum > 12);
    setErrores((prev) => ({
      ...prev,
      edad: error
    }));
  }}
  className={`w-full mb-4 p-2 border rounded ${errores.edad ? "border-red-500" : ""}`}
/>


        <label className="block mb-2 text-sm font-medium">Edad (meses):</label>
        <input
  type="text"
  placeholder="0"
  value={edadMeses}
  onChange={(e) => {
    const valor = e.target.value;
    setEdadMeses(valor);

    // Validación automática
    const aniosNum = parseInt(edadAnios, 10);
    const numero = parseInt(valor, 10);
    const error =
      (isNaN(aniosNum) || aniosNum <= 0 || aniosNum > 50) &&
      (isNaN(numero) || numero <= 0 || numero > 12);
    setErrores((prev) => ({
      ...prev,
      edad: error
    }));
  }}
  className={`w-full mb-4 p-2 border rounded ${errores.edad ? "border-red-500" : ""}`}
/>


        <label className="block mb-2 text-sm font-medium">Selecciona un avatar:</label>
        <div className="flex gap-3 mb-4">
          {avatars.map((a, i) => (
            <img
              key={i}
              src={a}
              onClick={() => setAvatarIndex(i)}
              className={`w-16 h-16 border-4 rounded-full cursor-pointer ${
                avatarIndex === i ? "border-blue-500" : "border-transparent"
              }`}
              alt={`Avatar ${i + 1}`}
            />
          ))}
        </div>

         <label className="block mt-6 mb-2 text-sm font-medium">Días de sesión:</label>
        <div className={`flex flex-wrap gap-2 mb-4 p-2 rounded border ${errores.sesiones ? "border-red-500 bg-red-50" : "border-transparent"}`}>
  {diasSemana.map((dia) => (
    <label key={dia} className="flex items-center gap-1 text-sm">
      <input
        type="checkbox"
        checked={diasSeleccionados.includes(dia)}
        onChange={() => toggleDia(dia)}
      />
      {dia}
    </label>
  ))}
</div>
{errores.sesiones && (
  <p className="text-sm text-red-500 mb-4">{errores.sesiones}</p>
)}


        {diasSeleccionados.map((dia) => (
  <div key={dia} className="mb-4 border p-2 rounded">
    <p className="font-semibold mb-2 text-blue-600">{dia}</p>

    <div className="flex gap-2 mb-2">
      <input
        type="time"
        value={infoSesiones[dia]?.inicio || ""}
        onChange={(e) => actualizarInfoSesion(dia, "inicio", e.target.value)}
        className={`w-1/2 p-1 border rounded ${errores[`horario-${dia}`] ? "border-red-500" : ""}`}
      />
      <input
        type="time"
        value={infoSesiones[dia]?.fin || ""}
        onChange={(e) => actualizarInfoSesion(dia, "fin", e.target.value)}
        className={`w-1/2 p-1 border rounded ${errores[`horario-${dia}`] ? "border-red-500" : ""}`}
      />
    </div>

    <select
      value={infoSesiones[dia]?.ubicacion || ""}
      onChange={(e) => actualizarInfoSesion(dia, "ubicacion", e.target.value)}
      className={`w-full p-2 border rounded ${errores[`ubicacion-${dia}`] ? "border-red-500" : ""}`}
    >
      <option value="">Selecciona ubicación</option>
      <option value="home">Home</option>
      <option value="school">School</option>
      <option value="office">Office</option>
      <option value="other">Other</option>
    </select>

    {/* Mensajes de error opcionales */}
    {errores[`horario-${dia}`] && (
      <p className="text-xs text-red-500 mt-1">Faltan horarios para este día.</p>
    )}
    {errores[`ubicacion-${dia}`] && (
      <p className="text-xs text-red-500 mt-1">Selecciona una ubicación válida.</p>
    )}
  </div>
))}


<label className="block mb-2 text-sm font-medium">Buscar comportamiento:</label>
        <input
          type="text"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por nombre o función"
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block mb-2 text-sm font-medium">Comportamientos:</label>
        <div className={`max-h-60 overflow-y-auto p-2 rounded ${errores.comportamientos ? "border border-red-500 bg-red-50" : "border"}`}>
        {errores.comportamientos && (
  <p className="text-sm text-red-500 mt-1">Debes seleccionar al menos un comportamiento.</p>
)}

          {Object.entries(comportamientosPorCategoria).map(([categoria, items]) => (
            <div key={categoria} className="mb-3">
              <p className="font-semibold text-sm text-blue-600 mb-1">{categoria}</p>
              {items.map((comp) => (
                <div key={comp.name} className="mb-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={comportamientosSeleccionados.includes(comp.name)}
                      onChange={() => toggleComportamiento(comp.name)}
                    />
                    {comp.name} ({comp.function})
                  </label>

                  {comportamientosSeleccionados.includes(comp.name) && (
                    <div className="ml-6 mt-1 flex flex-col gap-2">
  <div className="flex gap-2">
    <div className="flex flex-col">

      <input
  type="number"
  placeholder="Baseline"
  min={1}
  className={`w-24 p-1 border rounded ${erroresPorComportamiento[comp.name]?.baseline ? 'border-red-500' : ''}`}
  value={valoresPorComportamiento[comp.name]?.baseline || ""}
  onChange={(e) => {
    const baseline = parseInt(e.target.value, 10);

    setValoresPorComportamiento((prev) => ({
      ...prev,
      [comp.name]: {
        ...prev[comp.name],
        baseline: isNaN(baseline) ? "" : baseline
      }
    }));

    setErroresPorComportamiento((prev) => {
      const stoActual = valoresPorComportamiento[comp.name]?.sto || "";
      const stoValido = !isNaN(baseline) && parseInt(stoActual, 10) === baseline - 5;
      return {
        ...prev,
        [comp.name]: {
          baseline: isNaN(baseline) || baseline <= 0,
          sto: !stoValido
        }
      };
    });
  }}
/>


      {erroresPorComportamiento[comp.name]?.baseline && (
        <span className="text-xs text-red-500">Debe ser mayor que 0</span>
      )}
    </div>

    <div className="flex flex-col">
<input
  type="number"
  placeholder="STO"
  min={1}
  className={`w-24 p-1 border rounded ${erroresPorComportamiento[comp.name]?.sto ? 'border-red-500' : ''}`}
  value={valoresPorComportamiento[comp.name]?.sto || ""}
  onChange={(e) => {
    const sto = parseInt(e.target.value, 10);
    const baselineActual = valoresPorComportamiento[comp.name]?.baseline || 0;
    const stoValido = !isNaN(sto) && sto === baselineActual - 5;

    setValoresPorComportamiento((prev) => ({
      ...prev,
      [comp.name]: {
        ...prev[comp.name],
        sto: isNaN(sto) ? "" : sto
      }
    }));

    setErroresPorComportamiento((prev) => ({
      ...prev,
      [comp.name]: {
        ...prev[comp.name],
        sto: !stoValido
      }
    }));
  }}
/>


      {erroresPorComportamiento[comp.name]?.sto && (
        <span className="text-xs text-red-500">Debe ser exactamente 5 unidades menor que baseline</span>
      )}
    </div>
  </div>
</div>

                  )}
                </div>
              ))}
            </div>
          ))}
        </div>




        <div className="flex justify-end mt-6 gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
