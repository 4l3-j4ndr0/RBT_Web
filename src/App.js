import { BrowserRouter, Routes, Route } from "react-router-dom";
import PacientesPage from "./views/PacientesPage";
import PacienteDetalle from "./views/PacienteDetalle";
import ClienteDetalle from "./views/ClienteDetalle";
import DatasheetsView from "./views/DatasheetsView";
import ChartsView from "./views/ChartsView";
import NotesView from "./views/NotesView";
import NotaDetalleView from "./views/NotaDetalleView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PacientesPage />} />
        <Route path="/paciente/:id" element={<PacienteDetalle />} />
        <Route path="/clientes/:id" element={<ClienteDetalle />} />
        <Route path="/clientes/:id/datasheets" element={<DatasheetsView />} />
        <Route path="/clientes/:id/charts" element={<ChartsView />} />
        <Route path="/clientes/:id/notes" element={<NotesView/>} />
        <Route path="/clientes/:id/notes/:fecha" element={<NotaDetalleView />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
