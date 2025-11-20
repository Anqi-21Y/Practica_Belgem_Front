import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Articulos from "./pages/Articulos";
import Representantes from "./pages/Representantes";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route path="/representantes" element={<Representantes />} />
          <Route path="/Divisas" element={<Divisas/>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
