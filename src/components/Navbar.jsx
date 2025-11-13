import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ background: "#333", padding: "10px" }}>
      <Link to="/" style={{ color: "white", marginRight: "15px" }}>Inicio</Link>
      <Link to="/clientes" style={{ color: "white", marginRight: "15px" }}>Clientes</Link>
      <Link to="/articulos" style={{ color: "white", marginRight: "15px" }}>Artículos</Link>
      <Link to="/representantes" style={{ color: "white" }}>Representantes</Link>
    </nav>
  );
}
