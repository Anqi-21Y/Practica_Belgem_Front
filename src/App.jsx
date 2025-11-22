import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Articulos from "./pages/Articulos";
import Representantes from "./pages/Representantes";
import Divisas from "./pages/Divisas";
import NuevaDivisa from "./pages/NuevaDivisa";
import EditarDivisa from "./pages/EditarDivisa";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/representantes" element={<Representantes />} />
          <Route path="/divisas" element={<Divisas />} />
          <Route path="/divisas/nueva" element={<NuevaDivisa />} />
          <Route path="/divisas/editar/:id" element={<EditarDivisa />} />
         
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
