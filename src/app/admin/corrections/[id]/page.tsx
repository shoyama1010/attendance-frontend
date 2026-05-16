// src/app/admin/corrections/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Rest = {
  break_start: string | null;
  break_end: string | null;
};

type AdminCorrectionDetailView = {
  id: number;
  user_name: string;
  target_date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rests: Rest[];
  reason: string;
  status?: string;
};

function formatTime(value?: string | null): string {
  if (!value) return "";
  const parts = value.split(" ");
  const time = parts.length === 2 ? parts[1] : parts[0];
  return time.slice(0, 5);
}

function formatDate(value?: string | null): string {
  if (!value) return "";
  return value.replaceAll("-", "/");
}

function pickFirstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }
  return null;
}

function buildRests(source: Record<string, unknown>, data: Record<string, unknown>): Rest[] {
  const sourceRests = Array.isArray(source.rests) ? source.rests : null;
  const dataRests = Array.isArray(data.rests) ? data.rests : null;

  if (sourceRests && sourceRests.length > 0) {
    return sourceRests.map((rest) => {
      const item = typeof rest === "object" && rest !== null ? (rest as Record<string, unknown>) : {};
      return {
        break_start: pickFirstString(item.break_start, item.after_break_start, item.start_time),
        break_end: pickFirstString(item.break_end, item.after_break_end, item.end_time),
      };
    });
  }

  if (dataRests && dataRests.length > 0) {
    return dataRests.map((rest) => {
      const item = typeof rest === "object" && rest !== null ? (rest as Record<string, unknown>) : {};
      return {
        break_start: pickFirstString(item.break_start, item.after_break_start, item.start_time),
        break_end: pickFirstString(item.break_end, item.after_break_end, item.end_time),
      };
    });
  }

  const singleBreakStart = pickFirstString(
    source.after_break_start,
    source.break_start,
    source.rest_start,
    data.after_break_start,
    data.break_start,
    data.rest_start
  );

  const singleBreakEnd = pickFirstString(
    source.after_break_end,
    source.break_end,
    source.rest_end,
    data.after_break_end,
    data.break_end,
    data.rest_end
  );

  if (singleBreakStart || singleBreakEnd) {
    return [
      {
        break_start: singleBreakStart,
        break_end: singleBreakEnd,
      },
    ];
  }

  return [];
}

function normalizeCorrectionDetail(raw: unknown): AdminCorrectionDetailView {
  const data =
    typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};

  const source =
    (typeof data.attendance === "object" && data.attendance !== null
      ? (data.attendance as Record<string, unknown>)
      : null) ??
    (typeof data.correction_request === "object" && data.correction_request !== null
      ? (data.correction_request as Record<string, unknown>)
      : null) ??
    (typeof data.correction === "object" && data.correction !== null
      ? (data.correction as Record<string, unknown>)
      : null) ??
    data;

  return {
    id: Number(source.id ?? data.id ?? 0),
    user_name:
      pickFirstString(source.user_name, source.name, data.user_name, data.name) ?? "",
    target_date:
      pickFirstString(
        source.target_date,
        source.date,
        source.work_date,
        data.target_date,
        data.date,
        data.work_date
      ) ?? "",
    clock_in_time:
      pickFirstString(
        source.after_clock_in,
        source.after_clock_in_time,
        source.clock_in_time,
        source.requested_clock_in,
        source.requested_clock_in_time,
        source.clock_in,
        data.after_clock_in,
        data.after_clock_in_time,
        data.clock_in_time,
        data.requested_clock_in,
        data.requested_clock_in_time,
        data.clock_in
      ),
    clock_out_time:
      pickFirstString(
        source.after_clock_out,
        source.after_clock_out_time,
        source.clock_out_time,
        source.requested_clock_out,
        source.requested_clock_out_time,
        source.clock_out,
        data.after_clock_out,
        data.after_clock_out_time,
        data.clock_out_time,
        data.requested_clock_out,
        data.requested_clock_out_time,
        data.clock_out
      ),
    rests: buildRests(source, data),
    reason:
      pickFirstString(source.reason, source.note, data.reason, data.note) ?? "",
    status: pickFirstString(source.status, data.status) ?? undefined,
  };
}

export default function AdminCorrectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [detail, setDetail] = useState<AdminCorrectionDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/corrections/${id}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();

        console.log("Admin correction detail raw:", data);

        const normalized = normalizeCorrectionDetail(data);
        console.log("Admin correction detail normalized:", normalized);

        setDetail(normalized);
      } catch (err) {
        console.error("API Error:", err);
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const hasRests = useMemo(() => {
    return (detail?.rests ?? []).length > 0;
  }, [detail]);

  const handleApprove = async () => {
    if (!id) return;

    try {
      setApproving(true);

      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      const decodedToken = xsrfToken ? decodeURIComponent(xsrfToken) : "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/corrections/${id}/approve`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "X-XSRF-TOKEN": decodedToken,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Approve API Error:", errorText);
        throw new Error(`HTTP Error: ${res.status}`);
      }

      setApproved(true);
    } catch (err) {
      console.error(err);
      alert("承認に失敗しました");
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return <div className="py-20 text-center text-lg text-gray-600">読み込み中…</div>;
  }

  if (!detail) {
    return <div className="py-20 text-center text-lg text-red-500">データが見つかりません。</div>;
  }

  return (
    <div className="mx-auto max-w-3xl rounded bg-white p-10 shadow">
      <h2 className="mb-8 text-2xl font-bold">勤務詳細</h2>

      <div className="space-y-6">
        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">名前</span>
          <span>{detail.user_name || "—"}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">日付</span>
          <span>{formatDate(detail.target_date) || "—"}</span>
        </div>

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">出勤・退勤</span>
          <span>
            {detail.clock_in_time || detail.clock_out_time
              ? `${formatTime(detail.clock_in_time)} ～ ${formatTime(detail.clock_out_time)}`
              : "— — ～ — —"}
          </span>
        </div>

        {hasRests ? (
          detail.rests.map((rest, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span className="font-semibold">
                {index === 0 ? "休憩" : `休憩${index + 1}`}
              </span>
              <span>
                {rest.break_start || rest.break_end
                  ? `${formatTime(rest.break_start)} ～ ${formatTime(rest.break_end)}`
                  : "— — ～ — —"}
              </span>
            </div>
          ))
        ) : (
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">休憩</span>
            <span>— — ～ — —</span>
          </div>
        )}

        <div className="flex justify-between border-b pb-2">
          <span className="font-semibold">備考（修正理由）</span>
          <span>{detail.reason || "—"}</span>
        </div>
      </div>

      {approved && (
        <p className="mb-6 text-right font-semibold text-green-600">承認済</p>
      )}

      <div className="mt-10 text-right">
        {approved ? (
          <button
            onClick={() => router.push("/admin/corrections/list")}
            className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
          >
            戻る
          </button>
        ) : (
          <button
            onClick={handleApprove}
            disabled={approving}
            className="rounded bg-black px-6 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {approving ? "承認中..." : "承認する"}
          </button>
        )}
      </div>
    </div>
  );
}