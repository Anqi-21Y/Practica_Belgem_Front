import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ProfileButton from './ProfileButton';

export default function Layout() {
  return (
    <div style={styles.container}>
      {/* Header con navegación y perfil */}
      <header style={styles.header}>
        <Navbar />
        <ProfileButton />
      </header>

      {/* Contenido principal */}
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    gap: '24px'
  },
  main: {
    flex: 1,
    padding: '32px',
    backgroundColor: '#f9fafb'
  }
};