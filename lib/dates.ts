/** Human-readable label for a reminder's next-due date relative to today. */
export function formatDue(nextDue: string): string {
  const due = new Date(nextDue);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return `Overdue by ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"}`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due in ${diff} days`;
}

/**
 * Parse a YYYY-MM-DD string into a local-time Date (midnight).
 * Using the (year, month, day) constructor avoids the UTC-vs-local
 * pitfall that `new Date("2026-04-10")` causes.
 */
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Relative "time ago" label for a past date: "Today", "Yesterday", "3 days ago", etc. */
export function formatLastWateredRelative(dateStr?: string): string {
  if (!dateStr) return "Not recorded";
  const date = parseLocalDate(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff} days ago`;
  if (diff < 14) return "1 week ago";
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  if (diff < 60) return "1 month ago";
  return `${Math.floor(diff / 30)} months ago`;
}

/** Ordinal suffix for a day number (1st, 2nd, 3rd, 4th…). */
function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** Absolute date label: "April 10th, 2026". */
export function formatLastWateredAbsolute(dateStr?: string): string {
  if (!dateStr) return "Not recorded";
  const date = parseLocalDate(dateStr);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[date.getMonth()]} ${ordinal(date.getDate())}, ${date.getFullYear()}`;
}
