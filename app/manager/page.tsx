'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Expense } from '@/app/types';
import { getUserRole } from '@/lib/getUserRole';

export default function ManagerPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
  checkAccess();
}, []);

const checkAccess = async () => {
  const data = await getUserRole();

  if (!data || data.role !== 'manager') {
    alert('Accès refusé');
    return;
  }
  setOrgId(data.organization_id);

  fetchPendingExpenses(data.organization_id);
};


const fetchPendingExpenses = async (orgId: string) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('status', 'pending')
    .eq('organization_id', orgId);
     if (error) {
      console.error(error);
      return;
    }

  setExpenses(data || []);
};
 

  
  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('expenses')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error(error);
      return;
    }

    // refresh list
    if (orgId) {
    fetchPendingExpenses(orgId);
   }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Validation des dépenses</h1>

      <div className="space-y-4">
        {expenses.map((e) => (
          <div
            key={e.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{e.description}</p>
              <p className="text-sm text-gray-500">{e.amount} €</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(e.id, 'approved')}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Approuver
              </button>

              <button
                onClick={() => updateStatus(e.id, 'rejected')}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Refuser
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}