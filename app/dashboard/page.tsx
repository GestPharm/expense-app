'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Expense } from '@/app/types';
import { getUserRole } from '@/lib/getUserRole';

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const data = await getUserRole();
    if (!data) return;

    setRole(data.role);
    fetchExpenses(data.organization_id, data.role);
  };

  const fetchExpenses = async (orgId: string, role: string) => {
    let query = supabase.from('expenses').select('*');
    query = query.eq('organization_id', orgId);

    if (role === 'user') {
      const { data: userData } = await supabase.auth.getUser();
      query = query.eq('user_id', userData.user?.id);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error(error);
      return;
    }

    // 🔥 transformer path → signed URL
    const enriched = await Promise.all(
      data.map(async (e) => {
        if (!e.receipt_url) return e;

        const { data: signed, error } = await supabase.storage
          .from('receipts')
          .createSignedUrl(e.receipt_url, 3600);

        if (error) {
          console.error(error);
          return e;
        }

        return {
          ...e,
          receipt_url: signed?.signedUrl || null
        };
      })
    );

    setExpenses(enriched as Expense[]);
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pending = expenses.filter(e => e.status === 'pending').length;
  const approved = expenses.filter(e => e.status === 'approved').length;

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-cyan-500">
          <p>Total dépenses</p>
          <p className="text-2xl font-bold">{total} €</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-yellow-500">
          <p>En attente</p>
          <p className="text-2xl font-bold">{pending}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500">
          <p>Validées</p>
          <p className="text-2xl font-bold">{approved}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Dépenses</h2>

        <div className="space-y-3">
          {expenses.map((e) => (
            <div
              key={e.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{e.description}</p>

                <span className={`text-xs px-2 py-1 rounded ${
                  e.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : e.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {e.status}
                </span>

                {/* 🔥 lien facture */}
                {e.receipt_url && (
                  <div>
                    <a
                      href={e.receipt_url}
                      target="_blank"
                      className="text-cyan-600 underline text-sm"
                    >
                      Voir facture
                    </a>
                  </div>
                )}
              </div>

              <p className="font-bold">{e.amount} €</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}