"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CorrectionRequestDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/correction-requests/${id}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [id]);

  if (!data) return <p className="text-center mt-10">読み込み中...</p>;

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">申請詳細</h2>

      <div className="border p-5 rounded bg-white w-[600px]">
        <p>申請者：{data.user_name}</p>
        <p>申請日時：{data.created_at}</p>
        <p>対象日：{data.target_date}</p>
        <p>理由：{data.reason}</p>

        <h3 className="mt-5 font-bold">変更内容</h3>
        <p>出勤：{data.before_clock_in} → {data.after_clock_in}</p>
        <p>退勤：{data.before_clock_out} → {data.after_clock_out}</p>
      </div>
    </div>
  );
}
