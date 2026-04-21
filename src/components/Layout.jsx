import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </main>
    </div>
  );
}
