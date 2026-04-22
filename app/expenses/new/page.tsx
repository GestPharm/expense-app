'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function NewExpense() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const  handleSubmit = async () => {
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    alert('Not logged in');
    return;
  }

  const user = authData.user;

  // 🔥 récupérer organisation
  const { data: member, error: memberError } = await supabase
    .from('members')
    .select('organization_id')
    .eq('user_id', user.id)
    .single();

  if (memberError || !member) {
    console.error(memberError);
    alert('No organization found');
    return;
  }

  let fileUrl = null;

  if (file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);

    if (uploadError) {
      console.error(uploadError);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    fileUrl = publicUrlData.publicUrl;
  }

  // 🔥 INSERT CORRECT
  const { error } = await supabase.from('expenses').insert([
    {
      amount: Number(amount),
      description,
      user_id: user.id,
      organization_id: member.organization_id,
      receipt_url: fileUrl,
      status: 'pending'
    }
  ]);

  if (error) {
    console.error(error);
    alert(error.message);
    return;
  }

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

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleSubmit}>
        Add
      </button>
    </div>
  );
}