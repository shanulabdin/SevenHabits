export function gridSvg(opts: {
  history: Record<string, boolean>;
  endDateKey: string;
  weeks: number;
  size: number;
  gap: number;
  filled: string;
  empty: string;
}) {
  const { history, endDateKey, weeks, size, gap, filled, empty } = opts;

  const totalDays = weeks * 7;

  function dateKeyToDate(dateKey: string) {
    const [y, m, d] = dateKey.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  function getDateKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function addDaysToKey(dateKey: string, deltaDays: number) {
    const dt = dateKeyToDate(dateKey);
    dt.setDate(dt.getDate() + deltaDays);
    return getDateKey(dt);
  }

  const firstKey = addDaysToKey(endDateKey, -(totalDays - 1));

  const width = weeks * size + (weeks - 1) * gap;
  const height = 7 * size + 6 * gap;

  let rects = "";

  for (let w = 0; w < weeks; w++) {
    for (let dow = 0; dow < 7; dow++) {
      const idx = w * 7 + dow;
      const key = addDaysToKey(firstKey, idx);
      const done = history[key] === true;

      const x = w * (size + gap);
      const y = dow * (size + gap);
      const color = done ? filled : empty;

      rects += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="3" ry="3" fill="${color}" />`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${rects}</svg>`;
}
