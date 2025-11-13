"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/components/Layout";

type Attendance = {
  id: number;
  user_name: string;
  date: string;
  clock_in_time: string;
  clock_out_time: string;
  rest_start: string | null;
  rest_end: string | null;
  note: string;
  status: string;
};

export default function AttendanceDetailPage() {
  const { id } = useParams();
  const [attendance, setAttendance] = useState<Attendance | null>(null);

  useEffect(() => {
    // fetch(`http://localhost:8080/api/attendances/${id}`)
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`)
      .then((res) => res.json())
      .then((data) => setAttendance(data))
      .catch((err) => console.error("API fetch error:", err));
  }, [id]);

  if (!attendance)
    return (
      <Layout>
        <p className="text-center mt-10 text-gray-500">読み込み中...</p>
      </Layout>
    );

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-8">勤務詳細</h2>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <tbody>
            <tr className="border-b">
              <th className="bg-gray-50 w-1/3 py-3 px-4 text-left font-medium">
                名前
              </th>
              <td className="py-3 px-4">{attendance.user_name}</td>
            </tr>
            <tr className="border-b">
              <th className="bg-gray-50 py-3 px-4">日付</th>
              <td className="py-3 px-4">{attendance.date}</td>
            </tr>
            <tr className="border-b">
              <th className="bg-gray-50 py-3 px-4">出勤・退勤</th>
              <td className="py-3 px-4">
                {attendance.clock_in_time} ～ {attendance.clock_out_time}
              </td>
            </tr>
            <tr className="border-b">
              <th className="bg-gray-50 py-3 px-4">休憩</th>
              <td className="py-3 px-4">
                {attendance.rest_start} ～ {attendance.rest_end}
              </td>
            </tr>
            <tr>
              <th className="bg-gray-50 py-3 px-4">備考</th>
              <td className="py-3 px-4">{attendance.note}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {attendance.status === "pending" && (
        <p className="text-red-500 text-center mt-4">
          ※承認待ちのため修正はできません。
        </p>
      )}

      <div className="text-center mt-8">
        <a
          href="/correction_requests"
          className="inline-block bg-gray-100 text-gray-700 px-5 py-2 rounded hover:bg-gray-200"
        >
          一覧に戻る
        </a>
      </div>
    </Layout>
  );
}
