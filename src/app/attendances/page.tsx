"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatDate, formatTime } from "@/components/utils/time";
import Layout from "@/components/Layout";

type Attendance = {
  id: number;
  user_name: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
};

export default function AttendanceListPage() {
  const [records, setRecords] = useState<Attendance[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <Layout>
      <h2 className='text-2xl font-bold mb-6'>勤務一覧</h2>

      {/* <table className='w-full shadow-md rounded-lg border-collapse bg-white'> */}
      <table className='w-full bg-white border border-gray-300 rounded-md shadow-sm text-sm'>
        <thead>
          <tr className='bg-gray-50 border-b border-gray-300 text-gray-700 text-sm'>
            <th className='px-6 py-3 font-medium border'>社員名</th>
            <th className='px-6 py-3 font-medium border'>日付</th>
            <th className='px-6 py-3 font-medium border'>出勤</th>
            <th className='px-6 py-3 font-medium border'>退勤</th>
            <th className='px-6 py-3 font-medium border'>詳細</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r.id} className='border hover:bg-gray-50 transition'>
              <td className='px-6 py-3 border'>{r.user_name}</td>
              <td className='px-6 py-3 border'>{formatDate(r.date)}</td>
              <td className='px-6 py-3 border'>
                {r.clock_in_time ? formatTime(r.clock_in_time) : "-"}
              </td>
              <td className='px-6 py-3 border'>
                {r.clock_out_time ? formatTime(r.clock_out_time) : "-"}
              </td>
              <td className='px-6 py-3 border text-blue-600 underline'>
                <Link href={`/attendances/${r.id}`}>詳細</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
