// Shared UI components and styles for all pages

export const C = {
  // Colors
  blue600: '#1d4ed8', blue700: '#1e40af', blue50: '#eff6ff', blue100: '#dbeafe',
  gray50: '#f8fafc', gray100: '#f1f5f9', gray200: '#e2e8f0', gray300: '#cbd5e1',
  gray400: '#94a3b8', gray500: '#64748b', gray600: '#475569', gray700: '#334155',
  gray800: '#1e293b', gray900: '#0f172a',
  red600: '#dc2626', red50: '#fef2f2', red100: '#fee2e2',
  green600: '#16a34a', green50: '#f0fdf4', green100: '#dcfce7',
  amber600: '#d97706', amber50: '#fffbeb',
};

// Page wrapper
export const pageStyle = {
  display: 'flex', flexDirection: 'column', height: '100%', fontFamily: "'Inter', system-ui, sans-serif", fontSize: '14px'
};

// Page header
export const headerStyle = {
  backgroundColor: 'white',
  borderBottom: '1px solid #e2e8f0',
  padding: '0 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '60px',
  flexShrink: 0,
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
};

// Content area
export const contentStyle = { flex: 1, overflow: 'auto', padding: '24px', backgroundColor: '#f8fafc' };

// Card
export const cardStyle = {
  backgroundColor: 'white',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
};

// Table
export const tableStyle = { width: '100%', borderCollapse: 'collapse' };
export const theadStyle = { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' };
export const thStyle = {
  padding: '11px 20px', textAlign: 'left', fontSize: '11px',
  fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px'
};
export const tdStyle = { padding: '13px 20px', fontSize: '13.5px', color: '#334155', borderBottom: '1px solid #f1f5f9' };

// Buttons
export const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: '7px',
  backgroundColor: '#1d4ed8', color: 'white', padding: '8px 16px',
  borderRadius: '6px', border: 'none', cursor: 'pointer',
  fontWeight: '600', fontSize: '13.5px', whiteSpace: 'nowrap', letterSpacing: '0.1px'
};
export const btnSecondary = {
  display: 'inline-flex', alignItems: 'center', gap: '7px',
  backgroundColor: 'white', color: '#475569', padding: '8px 16px',
  borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer',
  fontWeight: '500', fontSize: '13.5px', whiteSpace: 'nowrap'
};
export const btnDanger = {
  display: 'inline-flex', alignItems: 'center', gap: '7px',
  backgroundColor: '#fef2f2', color: '#dc2626', padding: '8px 16px',
  borderRadius: '6px', border: '1px solid #fecaca', cursor: 'pointer',
  fontWeight: '500', fontSize: '13.5px'
};

// Icon buttons
export const iconBtn = (color) => ({
  padding: '6px', background: 'transparent', border: 'none',
  cursor: 'pointer', color, borderRadius: '4px', display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s'
});

// Input
export const inputStyle = {
  width: '100%', padding: '8px 12px',
  border: '1px solid #e2e8f0', borderRadius: '6px',
  fontSize: '13.5px', color: '#1e293b', outline: 'none',
  backgroundColor: 'white', boxSizing: 'border-box',
  transition: 'border-color 0.15s'
};
export const selectStyle = { ...inputStyle, cursor: 'pointer' };
export const textareaStyle = { ...inputStyle, resize: 'vertical', lineHeight: '1.5' };
export const labelStyle = {
  display: 'block', fontSize: '12.5px', fontWeight: '600',
  color: '#475569', marginBottom: '6px', letterSpacing: '0.1px'
};

// Form group
export const formGroupStyle = { display: 'flex', flexDirection: 'column' };

// Alert
export const alertError = {
  backgroundColor: '#fef2f2', border: '1px solid #fecaca',
  borderRadius: '6px', padding: '12px 16px', marginBottom: '16px',
  display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626', fontSize: '13.5px'
};

// Badge
export const badge = (bg, color) => ({
  display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
  fontSize: '12px', fontWeight: '600', backgroundColor: bg, color
});

// Search bar
export const searchWrap = { position: 'relative', flexGrow: 1, minWidth: '240px', maxWidth: '380px' };
export const searchIcon = {
  position: 'absolute', left: '11px', top: '50%',
  transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none'
};
export const searchInput = {
  ...inputStyle, paddingLeft: '36px', paddingRight: '12px',
  paddingTop: '8px', paddingBottom: '8px'
};

// Page title
export const pageTitleStyle = { fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: 0 };
export const pageSubtitleStyle = { fontSize: '12px', color: '#94a3b8', marginTop: '2px' };

// Section heading in forms/views
export const sectionHeadStyle = {
  fontSize: '10.5px', fontWeight: '700', color: '#94a3b8',
  textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px'
};

// Spinner
export const Spinner = () => (
  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
    <div style={{ width: '36px', height: '36px', border: '3px solid #e2e8f0', borderTop: '3px solid #1d4ed8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
    <p style={{ marginTop: '14px', color: '#94a3b8', fontSize: '13px' }}>Cargando...</p>
  </div>
);

// Error Alert
export const ErrorAlert = ({ message }) => (
  <div style={alertError}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    <span>{message}</span>
  </div>
);

// Empty state
export const EmptyState = ({ text }) => (
  <tr>
    <td colSpan="100" style={{ padding: '48px', textAlign: 'center', color: '#94a3b8', fontSize: '13.5px' }}>
      <div style={{ marginBottom: '8px', fontSize: '28px' }}>📋</div>
      {text}
    </td>
  </tr>
);
