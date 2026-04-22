'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-white text-cyan-600 px-4 py-2 rounded hover:bg-gray-100 font-medium"
    >
      Déconnexion
    </button>
  );
}