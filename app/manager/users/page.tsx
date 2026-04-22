'use client';

import { useState } from 'react';
import { getUserRole } from '@/lib/getUserRole';

export default function CreateUser() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const createUser = async () => {
    const data = await getUserRole();

    await fetch('/api/create-user', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        role,
        organization_id: data?.organization_id
      })
    });

    alert('Utilisateur créé');
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-xl shadow space-y-4">
      <h1 className="text-xl font-bold">Créer un utilisateur</h1>

      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 rounded"
        placeholder="Mot de passe temporaire"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded"
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="user">User</option>
        <option value="manager">Manager</option>
      </select>

      <button
        onClick={createUser}
        className="bg-cyan-600 text-white w-full p-2 rounded"
      >
        Créer
      </button>
    </div>
  );
}