"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import { formatDate, formatTimeForInput } from "@/components/utils/time";

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
  const router = useRouter();

  const [record, setRecord] = useState<Attendance | null>(null);
  const [loading, setLoading] = useState(true);

  // フォームの state
  const [clockIn, setClockIn] = useState("");
  const [clockOut, setClockOut] = useState("");
  const [restStart, setRestStart] = useState("");
  const [restEnd, setRestEnd] = useState("");
  const [note, setNote] = useState("");

  // データ取得
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRecord(data);

        setClockIn(formatTimeForInput(data.clock_in_time));
        setClockOut(formatTimeForInput(data.clock_out_time));
        
        setRestStart(formatTimeForInput(data.rest_start));
        setRestEnd(formatTimeForInput(data.rest_end));
        setNote(data.note ?? "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // 保存処理
  const handleUpdate = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/attendances/${id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clock_in_time: clockIn,
          clock_out_time: clockOut,
          rest_start: restStart,
          rest_end: restEnd,
          note: note,
        }),
      }
    );

    if (res.ok) {
      alert("変更を保存しました");
      router.push("/attendances");
    } else {
      alert("更新に失敗しました");
    }
  };

  if (loading || !record) {
    return (
      <Layout>
        <p className="text-center mt-10">読み込み中...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-center text-2xl font-bold my-8">勤務詳細</h2>

      <div className="flex justify-center">
        <div className="w-[700px] bg-white shadow-md rounded-lg border p-6">

          {/* 名前・日付 */}
          <table className="w-full border mb-6 text-sm">
            <tbody>
              <tr>
                <th className="border p-3 bg-gray-50 w-1/3">名前</th>
                <td className="border p-3">{record.user_name}</td>
              </tr>
              <tr>
                <th className="border p-3 bg-gray-50">日付</th>
                <td className="border p-3">{formatDate(record.date)}</td>
              </tr>
            </tbody>
          </table>

          {/* 編集フォーム */}
          <div className="space-y-6">

            {/* 出勤・退勤 */}
            <div>
              <label className="font-semibold block mb-2">出勤・退勤</label>
              <div className="flex gap-4">
                <input
                  type="time"
                  value={clockIn}
                  onChange={(e) => setClockIn(e.target.value)}
                  className="border p-2 rounded w-32"
                />
                <span className="pt-2">〜</span>
                <input
                  type="time"
                  value={clockOut}
                  onChange={(e) => setClockOut(e.target.value)}
                  className="border p-2 rounded w-32"
                />
              </div>
            </div>

            {/* 休憩 */}
            <div>
              <label className="font-semibold block mb-2">休憩</label>
              <div className="flex gap-4">
                <input
                  type="time"
                  value={restStart}
                  onChange={(e) => setRestStart(e.target.value)}
                  className="border p-2 rounded w-32"
                />
                <span className="pt-2">〜</span>
                <input
                  type="time"
                  value={restEnd}
                  onChange={(e) => setRestEnd(e.target.value)}
                  className="border p-2 rounded w-32"
                />
              </div>
            </div>

            {/* 備考 */}
            <div>
              <label className="font-semibold block mb-2">備考（修正理由など）</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="border p-2 rounded w-full h-24"
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handleUpdate}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
            >
              変更を保存
            </button>

            <button
              onClick={() => router.push("/attendances")}
              className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
            >
              一覧に戻る
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}
