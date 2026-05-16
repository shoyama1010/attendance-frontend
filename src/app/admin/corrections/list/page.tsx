// src/app/admin/corrections/list/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CorrectionStatus = "pending" | "approved";

type CorrectionRequest = {
  id: number;
  user_name: string;
  target_date: string;
  status: CorrectionStatus;
};

export default function AdminCorrectionListPage() {
  const [list, setList] = useState<CorrectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<CorrectionStatus>("pending");

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/correction-requests?status=${status}`;

        const res = await fetch(apiUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data: CorrectionRequest[] = await res.json();
        console.log("Admin  list data", data);
        setList(data);
      } catch (err) {
        console.error("API Error:", err);
        setList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [status]);

  if (loading) {
    return <div>読み込み中...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold">申請一覧（管理者）</h1>

      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setStatus("pending")}
          className={`rounded px-4 py-2 ${status === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
            }`}
        >
          承認待ち
        </button>
        <button
          onClick={() => setStatus("approved")}
          className={`rounded px-4 py-2 ${status === "approved"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700"
            }`}
        >
          承認済み
        </button>
      </div>

      <table className="w-full border border-gray-300 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-3">氏名</th>
            <th className="border p-3">対象日</th>
            <th className="border p-3">状態</th>
            <th className="border p-3">詳細</th>
          </tr>
        </thead>
        <tbody>
          {list.length > 0 ? (
            list.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="border p-3">{item.user_name}</td>
                <td className="border p-3">{item.target_date}</td>
                <td className="border p-3">
                  {item.status === "pending" ? "承認待ち" : "承認済み"}
                </td>
                <td className="border p-3 text-center">
                  <Link
                    href={`/admin/corrections/${item.id}`}
                    className="rounded bg-black px-3 py-1 text-sm text-white"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="p-6 text-center text-gray-500">
                データがありません。
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
