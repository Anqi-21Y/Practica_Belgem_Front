import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Clientes from "./pages/Clientes";
import Articulos from "./pages/Articulos";
import Representantes from "./pages/Representantes";
import Divisas from "./pages/Divisas";
import SeleccionUsuario from "./pages/SeleccionUsuario";
import Perfil from "./pages/Perfil";
import ProveedoresPage from "./pages/Proveedores";
import AlmacenesPage from "./pages/Almacen";
import MovimientoStockPage from "./pages/MovimientoStock";
import PedidosPage from "./pages/Pedidos";
import TiposMovimientoPage from "./pages/TiposMovimiento";
import './App.css';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta de selección de usuario (sin Layout) */}
          <Route path="/seleccion-usuario" element={<SeleccionUsuario />} />

          {/* Rutas con Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="articulos" element={<Articulos />} />
            <Route path="representantes" element={<Representantes />} />
            <Route path="divisas" element={<Divisas />} />
            <Route path="proveedores" element={<ProveedoresPage />} />
            <Route path="almacenes" element={<AlmacenesPage />} />
            <Route path="movimientos" element={<MovimientoStockPage />} />
            <Route path="pedidos" element={<PedidosPage />} />
            <Route path="tipos-movimiento" element={<TiposMovimientoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;