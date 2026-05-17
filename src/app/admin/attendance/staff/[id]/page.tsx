// src/app/admin/attendance/staff/[id]/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type MonthlyAttendanceRecord = {
  id: number;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_total: string | null;
  total_work: string | null;
};

type MonthlyAttendanceResponse = {
  user: {
    id: number;
    name: string;
  };
  month: string;
  records: MonthlyAttendanceRecord[];
};

function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  if (!year || !month) return value;
  return `${year}年${Number(month)}月`;
}

function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

function addMonths(value: string, diff: number): string {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() + diff);

  const nextYear = date.getFullYear();
  const nextMonth = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${nextYear}-${nextMonth}`;
}

export default function AdminStaffAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const month = searchParams.get("month") ?? getCurrentMonth();

  const [userName, setUserName] = useState("");
  const [records, setRecords] = useState<MonthlyAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const csvUrl = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/attendance/staff/${id}/csv?month=${month}`;
  }, [id, month]);

  useEffect(() => {
    if (!id) return;

    const fetchMonthlyAttendances = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/attendance/staff/${id}?month=${month}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Admin staff monthly attendance API Error:", errorText);
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data: MonthlyAttendanceResponse = await res.json();
        setUserName(data.user?.name ?? "");
        setRecords(data.records ?? []);
      } catch (error) {
        console.error(error);
        setUserName("");
        setRecords([]);
        setErrorMsg("スタッフ勤怠一覧の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchMonthlyAttendances();
  }, [id, month]);

  const moveMonth = (diff: number) => {
    const nextMonth = addMonths(month, diff);
    router.push(`/admin/attendance/staff/${id}?month=${nextMonth}`);
  };

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 shadow">
      <h1 className="mb-8 text-3xl font-bold">{userName}さんの勤怠一覧</h1>

      <div className="mb-6 flex items-center justify-between rounded bg-gray-50 px-6 py-4">
        <button
          type="button"
          onClick={() => moveMonth(-1)}
          className="text-blue-600 hover:underline"
        >
          ＜ 前月
        </button>

        <span className="text-2xl font-semibold">{formatMonth(month)}</span>

        <button
          type="button"
          onClick={() => moveMonth(1)}
          className="text-blue-600 hover:underline"
        >
          翌月 ＞
        </button>
      </div>

      {errorMsg && (
        <p className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      <div className="overflow-hidden rounded border border-gray-200">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b px-4 py-3 text-center font-semibold">日付</th>
              <th className="border-b px-4 py-3 text-center font-semibold">出勤</th>
              <th className="border-b px-4 py-3 text-center font-semibold">退勤</th>
              <th className="border-b px-4 py-3 text-center font-semibold">休憩</th>
              <th className="border-b px-4 py-3 text-center font-semibold">合計</th>
              <th className="border-b px-4 py-3 text-center font-semibold">詳細</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  読み込み中...
                </td>
              </tr>
            ) : records.length > 0 ? (
              records.map((record) => (
                <tr key={record.id} className="border-b last:border-b-0">
                  <td className="px-4 py-4 text-center">{record.date}</td>
                  <td className="px-4 py-4 text-center">{record.clock_in_time || "—"}</td>
                  <td className="px-4 py-4 text-center">{record.clock_out_time || "—"}</td>
                  <td className="px-4 py-4 text-center">{record.rest_total || "00:00"}</td>
                  <td className="px-4 py-4 text-center">{record.total_work || "—"}</td>
                  <td className="px-4 py-4 text-center">
                    <Link
                      href={`/admin/attendance/${record.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      詳細
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  この月の勤怠データはありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Link
          href="/admin/staff/list"
          className="rounded border border-gray-300 px-5 py-2 text-blue-600 hover:bg-gray-50"
        >
          ← スタッフ一覧に戻る
        </Link>

        <a
          href={csvUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded bg-black px-6 py-3 text-white hover:bg-gray-800"
        >
          CSV出力
        </a>
      </div>
    </div>
  );
}

