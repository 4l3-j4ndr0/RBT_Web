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

module.exports = router;
