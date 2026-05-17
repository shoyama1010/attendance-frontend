// src/app/admin/staff/list/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Staff = {
  id: number;
  name: string;
  email: string;
};

type StaffListResponse = {
  data: Staff[];
  current_page: number;
  last_page: number;
};

export default function AdminStaffListPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const [items, setItems] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(page);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/staff/list?page=${page}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Admin staff list API Error:", errorText);
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data: StaffListResponse = await res.json();
        setItems(data.data ?? []);
        setCurrentPage(data.current_page ?? 1);
        setLastPage(data.last_page ?? 1);
      } catch (error) {
        console.error(error);
        setItems([]);
        setErrorMsg("スタッフ一覧の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [page]);

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 shadow">
      <h1 className="mb-8 text-3xl font-bold">スタッフ一覧</h1>

      {errorMsg && (
        <p className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <div className="overflow-hidden rounded border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b px-4 py-3 text-left font-semibold">名前</th>
              <th className="border-b px-4 py-3 text-left font-semibold">メール</th>
              <th className="border-b px-4 py-3 text-center font-semibold">詳細</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  読み込み中...
                </td>
              </tr>
            ) : items.length > 0 ? (
              items.map((staff) => (
                <tr key={staff.id} className="border-b last:border-b-0">
                  <td className="px-4 py-4">{staff.name}</td>
                  <td className="px-4 py-4">{staff.email}</td>
                  <td className="px-4 py-4 text-center">
                    <Link
                      href={`/admin/attendance/staff/${staff.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  スタッフデータがありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!loading && lastPage > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Link
            href={`/admin/staff/list?page=${Math.max(1, currentPage - 1)}`}
            className={`rounded border px-4 py-2 ${currentPage === 1
                ? "pointer-events-none border-gray-200 text-gray-300"
                : "border-gray-300 hover:bg-gray-50"
              }`}
          >
            前へ
          </Link>

          {Array.from({ length: lastPage }, (_, index) => index + 1).map((num) => (
            <Link
              key={num}
              href={`/admin/staff/list?page=${num}`}
              className={`rounded border px-4 py-2 ${num === currentPage
                  ? "border-black bg-black text-white"
                  : "border-gray-300 hover:bg-gray-50"
                }`}
            >
              {num}
            </Link>
          ))}

          <Link
            href={`/admin/staff/list?page=${Math.min(lastPage, currentPage + 1)}`}
            className={`rounded border px-4 py-2 ${currentPage === lastPage
                ? "pointer-events-none border-gray-200 text-gray-300"
                : "border-gray-300 hover:bg-gray-50"
              }`}
          >
            次へ
          </Link>
        </div>
      )}
    </div>
  );
}

