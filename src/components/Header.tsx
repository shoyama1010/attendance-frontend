"use client";

export default function Header() {
  return (
    <header className="bg-black text-white py-3 px-8 flex justify-between items-center">
      <h1 className="text-lg font-bold tracking-widest">COACHTECH</h1>
      <nav className="flex gap-6 text-sm">
        <a href="/attendances" className="hover:text-gray-300">勤怠</a>
        <a href="/correction_requests" className="hover:text-gray-300">申請一覧</a>
        <a href="#" className="hover:text-gray-300">ログアウト</a>
      </nav>
    </header>
  );
}
