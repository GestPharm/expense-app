'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ensureUserOrganization } from '@/lib/onboarding';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user; // ✅ IMPORTANT

    const { data: member } = await supabase
  .from('members')
  .select('*')
  .eq('user_id', user.id)
  .single();

if (member.must_change_password) {
  router.push('/change-password');
  return;
}


    // 🔥 onboarding automatique
  await ensureUserOrganization(user);

    // redirect après login
    router.push('/dashboard');
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}