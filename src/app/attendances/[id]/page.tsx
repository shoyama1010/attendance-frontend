"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatDate, formatTime } from "@/components/utils/time";
import Layout from "@/components/Layout";

type Attendance = {
  id: number;
  user_name: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rest_start: string | null;
  rest_end: string | null;
  note: string | null;
  status: string;
};

export default function AttendanceDetailPage() {
  const { id } = useParams();
  const [attendance, setAttendance] = useState<Attendance | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`)
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error("API fetch error:", err));
  }, [id]);

  if (!attendance) {
    return (
      <Layout>
        <p className="text-center mt-10 text-gray-500">読み込み中...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">勤務詳細</h2>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden border">
        <tbody>
          <tr className="border-b">
            <th className="bg-gray-50 w-1/3 px-4 py-3 text-left font-medium">
              名前
            </th>
            <td className="px-4 py-3">{attendance.user_name}</td>
          </tr>

          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left font-medium">日付</th>
            <td className="px-4 py-3">{formatDate(attendance.date)}</td>
          </tr>

          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left font-medium">
              出勤・退勤
            </th>
            <td className="px-4 py-3">
              {formatTime(attendance.clock_in_time!)} ～{" "}
              {formatTime(attendance.clock_out_time!)}
            </td>
          </tr>

          <tr className="border-b">
            <th className="bg-gray-50 px-4 py-3 text-left font-medium">休憩</th>
            <td className="px-4 py-3">
              {attendance.rest_start && attendance.rest_end
                ? `${formatTime(attendance.rest_start)} ～ ${formatTime(attendance.rest_end)}`
                : "なし"}
            </td>
          </tr>

          <tr>
            <th className="bg-gray-50 px-4 py-3 text-left font-medium">備考</th>
            <td className="px-4 py-3">{attendance.note ?? "なし"}</td>
          </tr>
        </tbody>
      </table>

      {attendance.status === "pending" && (
        <p className="mt-6 text-center text-red-500 text-sm">
          ※承認待ちのため修正はできません。
        </p>
      )}

      <div className="text-center mt-6">
        <a href="/attendances" className="text-blue-600 underline">
          一覧に戻る
        </a>
      </div>
    </Layout>
  );
}
