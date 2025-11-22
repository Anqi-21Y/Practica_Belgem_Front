import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";


export default function EditarDivisa() {
    // de todo lo que viene en la URL, quiero obtener la parte que se llama id..
    const {id} = useParams();
    const navigate = useNavigate();

  // datos  de prueba provisionales
  const divisasMock = [
    { id: 1, codigo: "USD", cotizacion: 2.0, fechaActualizacion: "2025-11-20" },
    { id: 2, codigo: "EUR", cotizacion: 4.5, fechaActualizacion: "2025-11-19" },
    { id: 3, codigo: "GBP", cotizacion: 6.95, fechaActualizacion: "2025-11-18" },
  ];

  // buscamos la divisa por su id
  const divisaSeleccionada = divisasMock.find((d) => d.id === Number(id));

  // estado del formulario (precargado)
  const [form, setForm] = useState({
    codigo: divisaSeleccionada?.codigo || "",
    cotizacion: divisaSeleccionada?.cotizacion || "",
    fechaActualizacion: divisaSeleccionada?.fechaActualizacion || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Guardando cambios provisionales:", form);
    navigate("/divisas"); // vuelve a la lista
  };

  if (!divisaSeleccionada) {
    return <p>No existe una divisa con id {id}</p>;
  }

  return (
    <section>
        <h1>Editar Divisa</h1>
        <p>Estas editando al divisa con el ID {id} : </p>
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
      </form>
    </section>
  );
}
