// src/app/admin/attendance/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Rest = {
  break_start: string | null;
  break_end: string | null;
};

type AdminAttendanceDetailView = {
  id: number;
  user_name: string;
  date: string;
  clock_in_time: string | null;
  clock_out_time: string | null;
  rests: Rest[];
  note: string;
  status?: string;
};

function pickFirstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }
  return null;
}

function formatTime(value?: string | null): string {
  if (!value) return "";

  const trimmed = value.trim();

  if (/^\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed.slice(0, 5);
  }

  if (trimmed.includes("T")) {
    const timePart = trimmed.split("T")[1] ?? "";
    return timePart.slice(0, 5);
  }

  const parts = trimmed.split(" ");
  const timePart = parts.length > 1 ? parts[1] : parts[0];
  return timePart.slice(0, 5);
}

function formatDate(value?: string | null): string {
  if (!value) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value.replaceAll("-", "/");
  }

  if (value.includes("T")) {
    return value.slice(0, 10).replaceAll("-", "/");
  }

  return value.replaceAll("-", "/");
}

function buildRests(data: Record<string, unknown>): Rest[] {
  const rests = Array.isArray(data.rests) ? data.rests : null;

  if (rests && rests.length > 0) {
    return rests.map((rest) => {
      const item =
        typeof rest === "object" && rest !== null
          ? (rest as Record<string, unknown>)
          : {};

      return {
        break_start: pickFirstString(
          item.break_start,
          item.rest_start,
          item.start_time
        ),
        break_end: pickFirstString(
          item.break_end,
          item.rest_end,
          item.end_time
        ),
      };
    });
  }

  const singleBreakStart = pickFirstString(
    data.break_start,
    data.rest_start,
    data.before_break_start,
    data.after_break_start
  );

  const singleBreakEnd = pickFirstString(
    data.break_end,
    data.rest_end,
    data.before_break_end,
    data.after_break_end
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

function normalizeAttendanceDetail(raw: unknown): AdminAttendanceDetailView {
  const data =
    typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {};

  const source =
    (typeof data.attendance === "object" && data.attendance !== null
      ? (data.attendance as Record<string, unknown>)
      : null) ?? data;

  return {
    id: Number(source.id ?? data.id ?? 0),
    user_name:
      pickFirstString(source.user_name, source.name, data.user_name, data.name) ?? "",
    date:
      pickFirstString(
        source.date,
        source.work_date,
        source.target_date,
        data.date,
        data.work_date,
        data.target_date
      ) ?? "",
    clock_in_time:
      pickFirstString(
        source.clock_in_time,
        source.clock_in,
        data.clock_in_time,
        data.clock_in
      ),
    clock_out_time:
      pickFirstString(
        source.clock_out_time,
        source.clock_out,
        data.clock_out_time,
        data.clock_out
      ),
    rests: buildRests(source),
    note: pickFirstString(source.note, data.note, source.reason, data.reason) ?? "",
    status: pickFirstString(source.status, data.status) ?? undefined,
  };
}

function statusLabel(status?: string): string {
  if (!status) return "—";
  if (status === "pending") return "承認待ち";
  if (status === "approved") return "承認済み";
  if (status === "rejected") return "却下";
  if (status === "left") return "退勤済み";
  return status;
}

export default function AdminAttendanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [detail, setDetail] = useState<AdminAttendanceDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/attendance/${id}`;
        // バックエンドの実URLが異なる場合はこの1行だけ修正

        const res = await fetch(apiUrl, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Admin attendance detail API Error:", errorText);
          throw new Error(`HTTP Error: ${res.status}`);
        }

        const data = await res.json();
        console.log("Admin attendance detail raw:", data);

        const normalized = normalizeAttendanceDetail(data);
        console.log("Admin attendance detail normalized:", normalized);

        setDetail(normalized);
      } catch (error) {
        console.error(error);
        setDetail(null);
        setErrorMsg("勤怠詳細の取得に失敗しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const hasRests = useMemo(() => {
    return (detail?.rests ?? []).length > 0;
  }, [detail]);

  if (loading) {
    return (
      <div className="py-20 text-center text-lg text-gray-600">読み込み中...</div>
    );
  }

  if (errorMsg) {
    return (
      <div className="mx-auto max-w-4xl p-10">
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-600">
          {errorMsg}
        </p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="py-20 text-center text-lg text-red-500">
        データが見つかりません。
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl rounded-xl bg-white p-10 shadow">
      <h1 className="mb-8 text-3xl font-bold">勤務詳細</h1>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-3">
          <span className="font-semibold">名前</span>
          <span>{detail.user_name || "—"}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <span className="font-semibold">日付</span>
          <span>{formatDate(detail.date) || "—"}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <span className="font-semibold">出勤・退勤</span>
          <span>
            {detail.clock_in_time || detail.clock_out_time
              ? `${formatTime(detail.clock_in_time)} ～ ${formatTime(detail.clock_out_time)}`
              : "— — ～ — —"}
          </span>
        </div>

        {hasRests ? (
          detail.rests.map((rest, index) => (
            <div
              key={`${rest.break_start ?? "empty"}-${rest.break_end ?? "empty"}-${index}`}
              className="flex items-center justify-between border-b pb-3"
            >
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
          <div className="flex items-center justify-between border-b pb-3">
            <span className="font-semibold">休憩</span>
            <span>— — ～ — —</span>
          </div>
        )}

        <div className="flex items-center justify-between border-b pb-3">
          <span className="font-semibold">備考</span>
          <span>{detail.note || "（備考なし）"}</span>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <span className="font-semibold">状態</span>
          <span>{statusLabel(detail.status)}</span>
        </div>
      </div>

      <div className="mt-10 text-right">
        <button
          type="button"
          onClick={() => router.push("/admin/attendance/list")}
          className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
        >
          一覧に戻る
        </button>
      </div>
    </div>
  );
}