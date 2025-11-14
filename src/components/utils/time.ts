export function formatDate(dateString: string) {
  const d = new Date(dateString);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatTime(dateString: string) {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleTimeString("ja-JP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

