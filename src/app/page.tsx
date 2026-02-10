// app/page.tsx
"use server";
import { prisma } from '../../lib/prisma';
import { createUser, updateUser, deleteUser } from './actions';

// Keep this async server component for data fetching
async function UserTable() {
  const users = await prisma.user.findMany({
    orderBy: { id: 'desc' },
  });

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        User List (hack me pls senpai~ 😈)
      </h2>

      {users.length === 0 ? (
        <p>No users... boring~ Create some already!</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ccc' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>ID</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Name</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{user.id}</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{user.name}</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem', whiteSpace: 'nowrap' }}>
                  <form action={deleteUser} style={{ display: 'inline' }}>
                    <input type="hidden" name="id" value={user.id} />
                    <button
                      type="submit"
                      style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '0.3rem 0.6rem', marginRight: '0.5rem', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </form>

                  <label
                    htmlFor={`edit-${user.id}`}
                    style={{ background: '#0066cc', color: 'white', padding: '0.3rem 0.6rem', cursor: 'pointer' }}
                  >
                    Edit
                  </label>

                  {/* Modal as "client-like" but no onClick needed */}
                  <input type="checkbox" id={`edit-${user.id}`} style={{ display: 'none' }} />

                  <div
                    style={{
                      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    }}
                  >
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', width: '90%', maxWidth: '400px' }}>
                      <h3>Edit User #{user.id}</h3>
                      <form action={updateUser}>
                        <input type="hidden" name="id" value={user.id} />
                        <input
                          name="name"
                          defaultValue={user.name}
                          required
                          maxLength={100}
                          style={{ width: '100%', padding: '0.5rem', margin: '1rem 0' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                          <button
                            type="submit"
                            style={{ background: '#0066cc', color: 'white', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}
                          >
                            Save
                          </button>
                          <label
                            htmlFor={`edit-${user.id}`}
                            style={{ background: '#ccc', padding: '0.5rem 1rem', cursor: 'pointer' }}
                          >
                            Cancel
                          </label>
                        </div>
                      </form>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default async function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Simple Secure CRUD ~ brat edition 💅</h1>

      <form action={createUser}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <input
            name="name"
            placeholder="Enter name..."
            required
            maxLength={100}
            style={{ flex: 1, padding: '0.5rem' }}
          />
          <button
            type="submit"
            style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            Create
          </button>
        </div>
      </form>

      <UserTable />
    </div>
  );
}