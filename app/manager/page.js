'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ManagerPage() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const { data: user } = await supabase.auth.getUser();

    const { data: member } = await supabase
      .from('members')
      .select('organization_id, role')
      .eq('user_id', user.user.id)
      .single();

    if (member.role !== 'manager') {
      alert('Not authorized');
      return;
    }

    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('organization_id', member.organization_id)
      .eq('status', 'pending');

    setExpenses(data || []);
  };

  const updateStatus = async (id, status) => {
    await supabase
      .from('expenses')
      .update({ status })
      .eq('id', id);

    fetchExpenses();
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Manager Dashboard</h1>

      {expenses.map((e) => (
        <div key={e.id} style={{ marginBottom: 20 }}>
          <p>{e.amount} € - {e.description}</p>

          <button onClick={() => updateStatus(e.id, 'approved')}>
            Approve
          </button>

          <button onClick={() => updateStatus(e.id, 'rejected')}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}