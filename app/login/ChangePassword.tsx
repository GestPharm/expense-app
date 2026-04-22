'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ChangePassword() {
  const [password, setPassword] = useState('');

  const updatePassword = async () => {
    await supabase.auth.updateUser({
      password
    });

    // update flag
    await supabase
      .from('members')
      .update({ must_change_password: false })
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

    alert('Mot de passe mis à jour');
  };

  return (
    <div className="max-w-md bg-white p-6 rounded-xl shadow space-y-4">
      <h1 className="text-xl font-bold">Changer mot de passe</h1>

      <input
        type="password"
        className="w-full border p-2 rounded"
        placeholder="Nouveau mot de passe"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={updatePassword}
        className="bg-cyan-600 text-white w-full p-2 rounded"
      >
        Mettre à jour
      </button>
    </div>
  );
}