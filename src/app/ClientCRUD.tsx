// app/ClientCRUD.tsx
'use client';

import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, type ActionResult } from './actions';

type User = { id: number; name: string };

export default function ClientCRUD() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [createState, createAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData) => {
      setLoading(true);
      setError(null);
      setSuccess(null);
      const result = await createUser(_prev, formData);
      if (result.success) {
        getUsers().then(res => {
          setUsers(res.users);
          setLoading(false);
        })
          .catch(err => {
            console.error('Error fetching users:', err);
            setError('Error al cargar usuarios.');
            setLoading(false);
          });
        setSuccess('Usuario creado éxitosamente.');
      }
      return result;
    },
    { success: false }
  );

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append('id', id.toString());
    const result = await deleteUser(formData);
    if (result.success) {
      getUsers()
        .then(res => {
          setUsers(res.users);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching users:', err);
          setError('Error al cargar usuarios.');
          setLoading(false);
        });
      setSuccess('Usuario eliminado éxitosamente.');
    } else {
      setError('Error al eliminar usuario.');
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then(res => {
        setUsers(res.users);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        setError('Error al cargar usuarios.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      {/* Create Form */}
      <form action={createAction} style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            name="name"
            placeholder="Ingresar nombre de usuario..."
            required
            maxLength={100}
            style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
          />
          <button
            type="submit"
            style={{ padding: '0.75rem 1.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Crear Usuario
          </button>
        </div>
      </form>
      {/* Area para renderizar errores y mensajes de éxito */}
      {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '0.5rem' }}>{success}</p>}
      {/* Table */}
      <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Registro de Usuarios</h2>
      {users && users.length === 0 ? (
        <p>Vacío~</p>
      ) : users ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem' }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem' }}>Nombre</th>
              <th style={{ border: '1px solid #ddd', padding: '0.75rem' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem' }}>{user.id}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem' }}>{user.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '0.75rem' }}>
                  <button
                    onClick={() => setEditingUser(user)}
                    style={{ background: '#0066cc', color: 'white', border: 'none', padding: '0.5rem 1rem', marginRight: '0.5rem', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    style={{ background: '#dc3545', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px' }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {/* Edit Modal */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            getUsers()
              .then(res => {
                setUsers(res.users);
                setLoading(false);
              })
              .catch(err => {
                console.error('Error fetching users:', err);
                setError('Error al cargar usuarios.');
                setLoading(false);
              });
            setEditingUser(null);
          }}
        />
      )}
    </>
  );
}

// Bonus: separate modal component for cleanliness
function EditModal({
  user,
  onClose,
  onSuccess,
}: {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [state, formAction] = useActionState<ActionResult, FormData>(
    async (_prev, formData) => {
      const result = await updateUser(_prev, formData);
      if (result.success) {
        onSuccess();
        onClose();
      }
      return result;
    },
    { success: false }
  );
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
        <h3 style={{ margin: '0 0 1rem' }}>Edit User #{user.id}</h3>
        <form action={formAction}>
          <input type="hidden" name="id" value={user.id} />
          <input
            name="name"
            defaultValue={user.name}
            required
            maxLength={100}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
          />
          {state.error && <p style={{ color: 'red', margin: '0.5rem 0' }}>{state.error}</p>}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              style={{ padding: '0.5rem 1rem', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.5rem 1rem', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}