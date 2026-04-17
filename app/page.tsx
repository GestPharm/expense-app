import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Expense App</h1>

      <ul>
        <li><Link href="/login">Login</Link></li>
        <li><Link href="/expenses/new">Add Expense</Link></li>
        <li><Link href="/dashboard">Dashboard</Link></li>
      </ul>
    </div>
  );
}