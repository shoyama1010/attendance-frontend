import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto py-10 px-6">{children}</main>
    </div>
  );
}
