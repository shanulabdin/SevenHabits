export function getDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function dateKeyToDate(dateKey: string) {
  // dateKey is "YYYY-MM-DD"
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d); // local date (safe for day math)
}

export function addDaysToKey(dateKey: string, deltaDays: number) {
  const d = dateKeyToDate(dateKey);
  d.setDate(d.getDate() + deltaDays);
  return getDateKey(d);
}

export function getLastNDays(n: number) {
  const days: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}