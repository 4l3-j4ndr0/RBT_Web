// src/helpers/dataGenerator.js

/**
 * Genera data simulada diaria con variabilidad clínica entre BL y STO
 * @param {number} baseLine
 * @param {number} sto
 * @returns Array con 5 objetos: { day, value }
 */
export function generarDataConVariabilidadClinica(baseLine, sto) {
    const rangoMin = Math.min(baseLine, sto) - 2;
    const rangoMax = Math.max(baseLine, sto) + 2;
  
    const data = [];
  
    for (let i = 0; i < 5; i++) {
      const valor = Math.floor(Math.random() * (rangoMax - rangoMin + 1)) + rangoMin;
      data.push({
        day: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"][i],
        value: valor < 0 ? 0 : valor
      });
    }
  
    return data;
  }
  
  /**
   * Genera data según tendencia con ligera variabilidad por día
   * @param {string} tipo - "ascendente" | "descendente" | "lineal"
   * @param {number} baseLine
   * @param {number} sto
   * @returns Array con 5 objetos: { day, value }
   */
  export function generarDataPorTendencia(tipo, baseLine, sto) {
    const data = [];
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  
    for (let i = 0; i < 5; i++) {
      let valor = 0;
  
      if (tipo === "ascendente") {
        valor = baseLine + Math.floor((sto - baseLine) * (i / 4)) + Math.floor(Math.random() * 3);
      } else if (tipo === "descendente") {
        valor = baseLine - Math.floor((baseLine - sto) * (i / 4)) - Math.floor(Math.random() * 3);
      } else {
        // lineal con pequeña variación
        const media = (baseLine + sto) / 2;
        valor = Math.floor(media + Math.random() * 4 - 2);
      }
  
      data.push({
        day: dias[i],
        value: valor < 0 ? 0 : valor
      });
    }
  
    return data;
  }
  