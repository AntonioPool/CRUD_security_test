// app/page.tsx
import ClientCRUD from './ClientCRUD'; // we'll create this next

export default async function Home() {

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>
        Registro de Usuarios
      </h1>
        <ClientCRUD />
    </div>
  );
}