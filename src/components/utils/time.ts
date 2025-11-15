// 日付（Y-m-d）を "YYYY/MM/DD" に変換
export function formatDate(dateString: string | null) {
  if (!dateString) return "-";

  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "-";

  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${y}/${m}/${day}`;
}

// 時刻（"HH:MM:SS" または ISO）を "HH:MM" に変換
export function formatTime(time: string | null) {
  if (!time) return "-";

  // すでに ISO 形式の場合はそのまま new Date でOK
  // time: "2025-11-12T10:00:00.000000Z"
  const iso = new Date(time);
  if (!isNaN(iso.getTime())) {
    return iso.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // "20:52:00" のように時刻のみ → 1970-01-01 として扱う
  const fixed = `1970-01-01T${time}`;
  const d = new Date(fixed);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// // 09:15:00 → 09:15
// export function formatTimeForInput(time: string | null) {
//   if (!time) return "";

//   const date = new Date(time); // ISO文字列を Date に変換
//   const h = String(date.getHours()).padStart(2, "0");
//   const m = String(date.getMinutes()).padStart(2, "0");
//    return `${h}:${m}`;
//   // return time.substring(0, 5);
// }

export function formatTimeForInput(time: string | null) {
  if (!time) return "";

  // パターン① ISO形式 (2025-11-15T08:14:00.000000Z)
  if (time.includes("T")) {
    const date = new Date(time);
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  }

  // パターン② "HH:MM:SS" 形式 (例: 19:02:00)
  if (time.match(/^\d{2}:\d{2}/)) {
    const [h, m] = time.split(":");
    return `${h}:${m}`;
  }

  return "";
}
