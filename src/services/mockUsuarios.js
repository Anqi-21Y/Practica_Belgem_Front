/**
 * Datos mock de usuarios para desarrollo
 * Usar cuando el backend no esté disponible
 */
const mockUsuarios = [
    {
        id: 1,
        nombre: 'Administrador Principal',
        rol: 'ADMIN',
        email: 'admin@belgem.com',
        telefono: '+34 600 111 222',
        activo: true,
        fechaCreacion: '2024-01-15'
    },
    {
        id: 2,
        nombre: 'Juan Pérez',
        rol: 'REPRESENTANTE',
        email: 'juan.perez@belgem.com',
        telefono: '+34 600 222 333',
        activo: true,
        fechaCreacion: '2024-02-01'
    },
    {
        id: 3,
        nombre: 'María García',
        rol: 'REPRESENTANTE',
        email: 'maria.garcia@belgem.com',
        telefono: '+34 600 333 444',
        activo: true,
        fechaCreacion: '2024-02-15'
    },
    {
        id: 4,
        nombre: 'Carlos Rodríguez',
        rol: 'CLIENTE',
        email: 'carlos.rodriguez@example.com',
        telefono: '+34 600 444 555',
        activo: true,
        fechaCreacion: '2024-03-01'
    },
    {
        id: 5,
        nombre: 'Ana Martínez',
        rol: 'CLIENTE',
        email: 'ana.martinez@example.com',
        telefono: '+34 600 555 666',
        activo: true,
        fechaCreacion: '2024-03-10'
    },
    {
        id: 6,
        nombre: 'Pedro Sánchez',
        rol: 'REPRESENTANTE',
        email: 'pedro.sanchez@belgem.com',
        telefono: '+34 600 666 777',
        activo: false,
        fechaCreacion: '2024-03-20'
    }
];

export default mockUsuarios;