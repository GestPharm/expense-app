import Sidebar from '@/components/Sidebar';
import './globals.css';
import LogoutButton from '@/components/LogoutButton';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-100">
        <div className="flex min-h-screen">

          <Sidebar />

          <div className="flex-1 flex flex-col">
           
            <header className="bg-cyan-600 text-white shadow px-6 py-4 flex justify-between items-center">
              <span className="font-semibold">Expense SaaS</span>

              <LogoutButton />
            </header>

            <main className="p-6 flex-1">
              {children}
            </main>
          </div>

        </div>
      </body>
    </html>
  );
}