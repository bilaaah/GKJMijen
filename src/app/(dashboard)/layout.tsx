import { Header, Sidebar, Footer } from '@/components/layouts';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4 bg-light">
          <div className="container-fluid">{children}</div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
