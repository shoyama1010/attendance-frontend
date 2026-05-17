"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type DailyAttendanceRecord = {
  id: number;
  user_name: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_total: string | null;
  total_work: string | null;
};

type DailyAttendanceResponse =
  | {
    date?: string;
    records?: DailyAttendanceRecord[];
  }
  | DailyAttendanceRecord[];

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateForTitle(value: string): string {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${Number(year)}年${Number(month)}月${Number(day)}日の勤怠`;
}

function addDays(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return formatDateForInput(date);
}

function extractTime(value: string | null | undefined): string {
  if (!value) return "—";
  const trimmed = value.trim();

  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }

  const parts = trimmed.split(" ");
  const timePart = parts.length > 1 ? parts[1] : parts[0];

  if (timePart.includes("T")) {
    const isoTime = timePart.split("T")[1] ?? "";
    return isoTime.slice(0, 5) || "—";
  }

  return timePart.slice(0, 5) || "—";
}

function normalizeResponse(data: DailyAttendanceResponse): DailyAttendanceRecord[] {
  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: Number(item.id),
      user_name: item.user_name ?? "",
      clock_in_time: item.clock_in_time ?? null,
      clock_out_time: item.clock_out_time ?? null,
      rest_total: item.rest_total ?? null,
      total_work: item.total_work ?? null,
    }));
  }

  return (data.records ?? []).map((item) => ({
    id: Number(item.id),
    user_name: item.user_name ?? "",
    clock_in_time: item.clock_in_time ?? null,
    clock_out_time: item.clock_out_time ?? null,
    rest_total: item.rest_total ?? null,
    total_work: item.total_work ?? null,
  }));
}

export default function AdminDailyAttendanceListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = useMemo(() => formatDateForInput(new Date()), []);
  const queryDate = searchParams.get("date") || today;

  const [selectedDate, setSelectedDate] = useState(queryDate);
  const [records, setRecords] = useState<DailyAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setSelectedDate(queryDate);
  }, [queryDate]);

  useEffect(() => {
    const fetchDailyAttendances = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/attendance/list?date=${queryDate}`;
        // API の実ルートが異なる場合は上の 1 行だけ調整

        const res = await fetch(apiUrl, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Daily attendance API Error:", errorText);
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data: DailyAttendanceResponse = await res.json();
        setRecords(normalizeResponse(data));
      } catch (error) {
        console.error(error);
        setRecords([]);
        setErrorMsg("勤怠一覧の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyAttendances();
  }, [queryDate]);

  const moveDate = (days: number) => {
    const nextDate = addDays(queryDate, days);
    router.push(`/admin/attendance/list?date=${nextDate}`);
  };

  const handleSearch = () => {
    router.push(`/admin/attendance/list?date=${selectedDate}`);
  };

  return (
    <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 shadow">
      <h1 className="mb-8 text-center text-3xl font-bold">
        {formatDateForTitle(queryDate)}
      </h1>

      <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => moveDate(-1)}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← 前日
        </button>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded border border-gray-300 px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={handleSearch}
          className="rounded bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          表示
        </button>

        <button
          type="button"
          onClick={() => moveDate(1)}
          className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          翌日 →
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
              <th className="border-b px-4 py-3 text-center font-semibold">名前</th>
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
                  <td className="px-4 py-4 text-center">{record.user_name}</td>
                  <td className="px-4 py-4 text-center">
                    {extractTime(record.clock_in_time)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {extractTime(record.clock_out_time)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {record.rest_total || "00:00"}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {record.total_work || "—"}
                  </td>
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
                  この日の勤怠データはありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}