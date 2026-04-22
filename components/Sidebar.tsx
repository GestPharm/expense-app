'use client';

import { getUserRole } from '@/lib/getUserRole';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);

  const linkClass = (path: string) =>
    `block p-2 rounded ${
      pathname === path
        ? 'bg-cyan-100 text-cyan-700 font-semibold'
        : 'hover:bg-gray-100'
    }`;

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const data = await getUserRole();
    setRole(data?.role || null);
  };

  return (
    <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
      <h1 className="text-xl font-bold mb-8">Expense SaaS</h1>

      <nav className="space-y-2">
        <Link href="/dashboard" className={linkClass('/dashboard')}>
          Dashboard
        </Link>

        <Link href="/expenses/new" className={linkClass('/expenses/new')}>
          Nouvelle dépense
        </Link>

        {/* 👇 visible seulement pour manager */}
        {role === 'manager' && (
          <Link href="/manager" className={linkClass('/manager')}>
            Manager
          </Link>
        )}
      </nav>
    </aside>
  );
}