const express = require("express");
const router = express.Router();
const Paciente = require("../models/Paciente_models");

// Obtener todos los pacientes
router.get("/", async (req, res) => {
  const pacientes = await Paciente.find();
  res.json(pacientes);
});

// Crear nuevo paciente
router.post("/", async (req, res) => {
  const nuevoPaciente = new Paciente(req.body);
  await nuevoPaciente.save();
  res.json({ mensaje: "Paciente guardado" });
});

// Actualizar nota o data de un paciente
router.put("/:id", async (req, res) => {
  await Paciente.findByIdAndUpdate(req.params.id, req.body);
  res.json({ mensaje: "Paciente actualizado" });
});

// Eliminar paciente
router.delete("/:id", async (req, res) => {
    try {
      await Paciente.findByIdAndDelete(req.params.id);
      res.json({ mensaje: "Paciente eliminado" });
    } catch (err) {
      res.status(500).json({ error: "Error al eliminar paciente" });
    }
  });

  
// Obtener paciente por ID
router.get("/:id", async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ mensaje: "Paciente no encontrado" });
    res.json(paciente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener paciente por ID" });
  }
});

  // Obtener datasheet por ID de paciente
router.get("/:id/datasheets", async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente) return res.status(404).json({ mensaje: "Paciente no encontrado" });

    const hoy = new Date();
    const diaSemana = hoy.getDay() || 7;
    const lunes = new Date(hoy);
    lunes.setDate(hoy.getDate() - diaSemana + 1);

    const semanaData = paciente.comportamientos.map((comp) => {
      const datosSemana = Array(7).fill(null);

      comp.data.forEach((entrada) => {
        const fechaEntrada = new Date(entrada.fecha);
        const diff = Math.floor((fechaEntrada - lunes) / (1000 * 60 * 60 * 24));

        if (diff >= 0 && diff < 7) {
          datosSemana[diff] = entrada.valor;
        }
      });

      return {
        nombre: comp.nombre,
        descripcion: comp.descripcion,
        sto: comp.sto,
        semana: datosSemana,
      };
    });

    res.json(semanaData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener datasheets" });
  }
});

module.exports = router;
