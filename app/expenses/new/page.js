'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewExpense() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      alert('Not logged in');
      return;
    }

    const { data: member } = await supabase
  .from('members')
  .select('organization_id')
  .eq('user_id', user.id)
  .single();

   await supabase.from('expenses').insert([
      {
        user_id: user.id,
        organization_id: member.organization_id,
        amount,
        description
      }
    ]);

    alert('Expense added!');
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>New Expense</h1>

      <input
        placeholder="Amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <input
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}