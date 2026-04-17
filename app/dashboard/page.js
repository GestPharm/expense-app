'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);



  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
      const { data0 } = await supabase.auth.getUser();
    console.log(data0);
    const { data } = await supabase
      .from('expenses')
      .select('*');

    setExpenses(data);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Expenses</h1>

      {expenses.map((e) => (
        <div key={e.id}>
          {e.amount} € - {e.description} - {e.status}
        </div>
      ))}
    </div>
  );
}