import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Articulos from "./pages/Articulos";
import Representantes from "./pages/Representantes";
import Divisas from "./pages/Divisas";
import MovimientoStock from "./pages/MovimientoStock";
import './App.css';
import DivisasPage from "./pages/Divisas";
import ClientesPage from "./pages/Clientes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/movimientos" element={<MovimientoStock />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/clientes" element={<Layout><ClientesPage /></Layout>} />
        <Route path="/articulos" element={<Layout><Articulos /></Layout>} />
        <Route path="/representantes" element={<Layout><Representantes /></Layout>} />
        <Route path="/divisas" element={<Layout><DivisasPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;