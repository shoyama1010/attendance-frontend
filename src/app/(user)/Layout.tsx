"use client";

import {ReactNode,useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

type UserLayoutProps = {
  children: ReactNode;
};

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const isLogin = localStorage.getItem("isLogin");
    const role = localStorage.getItem("role");

    if (!isLogin || role !== "user") {
      router.push("/login");
    }
  }, []);

  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
