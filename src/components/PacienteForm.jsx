import { useState } from "react";
import Select from "react-select";
import { getBehaviorOptions } from "../helpers/behaviorOptions";
import {
    generarDataConVariabilidadClinica,
    generarDataPorTendencia
} from "../helpers/dataGenerator";


const tendencias = ["ascendente", "descendente", "lineal"];




export default function PacienteForm({ onCrearPaciente }) {
    const [modoAuto, setModoAuto] = useState(false);
    const [tendencia, setTendencia] = useState("ascendente");
    const [guardadoExitoso, setGuardadoExitoso] = useState(false);
    const [form, setForm] = useState({
        identificador: "",
        comportamientos: [],
        nota: "",
        data: [
            { day: "Lunes", value: "" },
            { day: "Martes", value: "" },
            { day: "Miércoles", value: "" },
            { day: "Jueves", value: "" },
            { day: "Viernes", value: "" },
        ],
        frecuenciaSemanal: [], // nuevo
        duracionHoras: "",     // nuevo
        duracionMinutos: "",   // nuevo
        ubicacionSesion: "",   // nuevo
    });


    const handleChange = (e, i = null) => {
        const { name, value } = e.target;
        if (i !== null) {
            const nuevaData = [...form.data];
            nuevaData[i].value = value;
            setForm({ ...form, data: nuevaData });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleComportamientosChange = (selectedOptions) => {
        const comportamientosExtendidos = selectedOptions.map((item) => {
            const existente = form.comportamientos?.find(c => c.value === item.value); // ← con `?.` por seguridad

            return existente || {
                label: item.label,
                value: item.value,
                categoria: item.categoria,
                funcion: item.funcion,
                baseLine: "",
                sto: "",
            };
        });

        setForm((prev) => ({ ...prev, comportamientos: comportamientosExtendidos }));
    };




    const handleCambioBLSTO = (index, campo, valor) => {
        const nuevos = [...form.comportamientos];
        nuevos[index][campo] = valor;
        setForm({ ...form, comportamientos: nuevos });
    };



    const generarDataConVariabilidadClinica = (BL, STO) => {
        const rangoMin = Math.min(BL, STO) - 2; // ligera variación hacia abajo
        const rangoMax = Math.max(BL, STO) + 2; // ligera variación hacia arriba

        const data = [];

        for (let i = 0; i < 5; i++) {
            const valor = Math.floor(
                Math.random() * (rangoMax - rangoMin + 1)
            ) + rangoMin;

            data.push({
                day: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][i],
                value: valor < 0 ? 0 : valor,
            });
        }

        return data;
    };


    const generarDataPorTendencia = (tipo) => {
        const BL = Math.floor(Math.random() * 20) + 40; // entre 40 y 60
        const intervalo = 5;
        const STO1 = tipo === "descendente" ? BL - intervalo : BL + intervalo;

        const data = [];

        for (let i = 0; i < 5; i++) {
            let valor;

            if (tipo === "ascendente") {
                valor = Math.floor(Math.random() * (STO1 - BL + 1)) + BL;
            } else if (tipo === "descendente") {
                valor = Math.floor(Math.random() * (BL - STO1 + 1)) + STO1;
            } else {
                valor = Math.floor(BL + Math.random() * 4 - 2); // alrededor del BL
            }

            data.push({
                day: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][i],
                value: valor < 0 ? 0 : valor,
            });
        }

        return data;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔍 Verificamos que todos los campos obligatorios estén definidos correctamente
        if (!form.identificador || form.comportamientos.length === 0) {
            alert("Debes completar el identificador y al menos un comportamiento.");
            return;
        }

        // ✅ Calculamos la duración total en minutos
        const duracionTotalMin =
            parseInt(form.duracionHoras || 0) * 60 + parseInt(form.duracionMinutos || 0);

        // 📦 Armamos el objeto completo del paciente
        const paciente = {
            identificador: form.identificador,
            nota: form.nota,
            comportamientos: form.comportamientos,
            frecuenciaSemanal: form.frecuenciaSemanal,
            duracionSesionMin: duracionTotalMin,
            ubicacionSesion: form.ubicacionSesion,
            modoAuto,
            tendencia,
            data: form.data.map((d) => ({
                ...d,
                value: parseInt(d.value || 0)
            }))
        };

        // 👀 Verificamos visualmente en consola antes de enviar
        console.log("Paciente a guardar ✅", paciente);

        // 🚀 Guardamos el paciente
        await onCrearPaciente(paciente);
        // mensaje de guardado exitoso
        setGuardadoExitoso(true);
        // Oculta el mensaje después de 3 segundos
        setTimeout(() => setGuardadoExitoso(false), 3000);

        // ♻️ Limpiamos el formulario para el siguiente paciente
        setForm({
            identificador: "",
            nota: "",
            comportamientos: [],
            data: form.data.map((d) => ({ ...d, value: "" })),
            frecuenciaSemanal: [],
            duracionHoras: "",
            duracionMinutos: "",
            ubicacionSesion: "",
        });
    };


    return (
        <form onSubmit={handleSubmit} className="mb-6">


            <h2 className="text-xl font-semibold mb-2">📝 Crear nuevo paciente</h2>
            {guardadoExitoso && (
  <div className="bg-green-200 text-green-800 px-4 py-2 rounded mb-4">
    ✅ Paciente guardado correctamente
  </div>
)}


            <div className="mb-2">
                <label className="mr-2">Identificador:</label>
                <input
                    type="text"
                    name="identificador"
                    value={form.identificador}
                    onChange={handleChange}
                    required
                    className="border px-2 py-1"
                />
            </div>

            <div className="mb-2">
                <label className="mr-2">Nota manual:</label>
                <input
                    type="text"
                    name="nota"
                    value={form.nota}
                    onChange={handleChange}
                    disabled={modoAuto}
                    className="border px-2 py-1"
                />
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Frecuencia semanal:</label>
                <div className="flex gap-2 flex-wrap">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((dia) => (
                        <label key={dia} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={form.frecuenciaSemanal.includes(dia)}
                                onChange={() => {
                                    const nuevaFrecuencia = form.frecuenciaSemanal.includes(dia)
                                        ? form.frecuenciaSemanal.filter(d => d !== dia)
                                        : [...form.frecuenciaSemanal, dia];
                                    setForm({ ...form, frecuenciaSemanal: nuevaFrecuencia });
                                }}
                            />
                            {dia}
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-4">
                <label className="block font-semibold mb-1">Duración de cada sesión:</label>
                <div className="flex gap-4">
                    <div>
                        <label className="block text-sm">Horas:</label>
                        <input
                            type="number"
                            min="0"
                            className="border px-2 py-1 w-20"
                            value={form.duracionHoras}
                            onChange={(e) => setForm({ ...form, duracionHoras: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm">Minutos:</label>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            className="border px-2 py-1 w-20"
                            value={form.duracionMinutos}
                            onChange={(e) => setForm({ ...form, duracionMinutos: e.target.value })}
                            required
                        />
                    </div>
                </div>
            </div>


            <div className="mb-4">
                <label className="block font-semibold mb-1">Ubicación de la sesión:</label>
                <select
                    className="border px-2 py-1"
                    value={form.ubicacionSesion}
                    onChange={(e) => setForm({ ...form, ubicacionSesion: e.target.value })}
                    required
                >
                    <option value="">Selecciona ubicación</option>
                    <option value="home">Home</option>
                    <option value="school">School</option>
                    <option value="office">Office</option>
                </select>
            </div>



            <div className="mb-4">
                <label className="mr-2">¿Autogenerar data?</label>
                <input
                    type="checkbox"
                    checked={modoAuto}
                    onChange={() => setModoAuto(!modoAuto)}
                />
                {modoAuto && (
                    <select
                        value={tendencia}
                        onChange={(e) => setTendencia(e.target.value)}
                        className="ml-3 border px-2 py-1"
                    >
                        {tendencias.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                )}
            </div>

            {!modoAuto && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {form.data.map((d, i) => (
                        <input
                            key={i}
                            type="number"
                            placeholder={d.day}
                            value={d.value}
                            onChange={(e) => handleChange(e, i)}
                            required
                            className="border px-2 py-1 w-24"
                        />
                    ))}
                </div>
            )}

            <div className="mb-4">
                <label className="block font-semibold mb-1">Seleccionar comportamientos:</label>
                <Select
                    isMulti
                    options={getBehaviorOptions()}
                    onChange={handleComportamientosChange}
                    value={form.comportamientos}
                    placeholder="Buscar y seleccionar comportamientos..."
                />
            </div>

            {form.comportamientos.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-2">Configura cada comportamiento:</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Array.isArray(form.comportamientos) && form.comportamientos.map((comp, index) => (
                            <div key={`${comp.value}-${index}`} className="border p-3 rounded bg-gray-50">
                                <p className="mb-2">
                                    <strong>{comp.label}</strong> (Función: {comp.funcion}, Categoría: {comp.categoria})
                                </p>
                                <div className="flex gap-4">
                                    <div>
                                        <label className="block text-sm font-medium">Base Line</label>
                                        <input
                                            type="number"
                                            value={comp.baseLine}
                                            onChange={(e) =>
                                                handleCambioBLSTO(index, "baseLine", e.target.value)
                                            }
                                            className="border px-2 py-1 w-24"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium">STO1</label>
                                        <input
                                            type="number"
                                            value={comp.sto}
                                            onChange={(e) =>
                                                handleCambioBLSTO(index, "sto", e.target.value)
                                            }
                                            className="border px-2 py-1 w-24"
                                        />

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Guardar paciente
            </button>
        </form>
    );
}
