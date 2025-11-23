import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function NuevaDivisa() {

  const navigate = useNavigate();

  // aquicreo el estado del formulario
  // empieza vacio porque estoy creando una nueva divisa
  // cada propiedad representa un campo real que pide el backend
  const [form, setForm] = useState({
  codigo: "",
  cotizacion: "",
  fechaActualizacion: "",
  });

  const handleChange = (e) => {
    setForm({ 
      ...form, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Divisa creada (provisional):", form);

    navigate("/divisas");
  };

  return (
    <section>
      <h1>Nueva Divisa</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Código:</label>
          <input
            name="codigo"
            value={form.codigo}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Cotización:</label>
          <input
            name="cotizacion"
            type="number"
            step="0.01"
            value={form.cotizacion}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Fecha actualización:</label>
          <input
            name="fechaActualizacion"
            type="date"
            value={form.fechaActualizacion}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Guardar</button>

        <Link to="/divisas">
            <button type="button">Volver</button>
        </Link>
      </form>
    </section>
 );
}
