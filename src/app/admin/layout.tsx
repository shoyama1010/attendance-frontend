"use client";
// import Link from "next/link";
import { ReactNode,useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/AdminHeader";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    const role = localStorage.getItem("role");

    if (!isLogin) {
      router.push("/login"); // 未ログインなら弾く
    }
  }, []);

  return (
    <>
      <AdminHeader />
      <main className='px-4 py-8 bg-gray-100 min-h-screen'>
        {children}
      </main>
    </>
  );
}

