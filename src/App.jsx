import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Articulos from "./pages/Articulos";
import Representantes from "./pages/Representantes";
import Divisas from "./pages/Divisas";
import './App.css';
import './App.css';
import DivisasPage from "./pages/Divisas";
import ClientesPage from "./pages/Clientes";


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/representantes" element={<Representantes />} />
          <Route path="/divisas" element={<Divisas />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
