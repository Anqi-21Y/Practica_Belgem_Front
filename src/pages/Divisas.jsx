import { Link } from "react-router-dom";
export default function Divisas() {
  
  const divisas =[
        {id: 1, codigo: "USD", cotizacion: 2.00, fechaActualizacion: "2025-11-20" },
        {id: 2, codigo: "EUR", cotizacion: 4.50, fechaActualizacion: "2025-11-19" },
        {id: 3, codigo: "GBP", cotizacion: 6.95, fechaActualizacion: "2025-11-18" },
  ];
  
  return (
    <section id="divisas">
      <h1>Lista de  Divisas</h1>
      <p> esto es un parrafo de divisas</p>
    
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Cotización</th>
            <th>Fecha actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {divisas.map((divisa) => (
            <tr key={divisa.id}>
              <td>{divisa.codigo}</td>
              <td>{divisa.cotizacion}</td>
              <td>{divisa.fechaActualizacion}</td>
              <td>
                <Link to={`/divisas/editar/${divisa.id}`}>
                  <button>Editar</button>
                </Link>

                <button>Borrar</button>

                <Link to="/divisas/nueva">
                  <button>Nueva Divisa</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

