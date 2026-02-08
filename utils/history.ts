export function generateFakeHistory(days = 98) {
  const history: Record<string, boolean> = {};
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);

    const baseChance = 0.7;
    const streakBonus = Math.min(streak * 0.03, 0.2);
    const done = Math.random() < baseChance + streakBonus;

    history[key] = done;
    streak = done ? streak + 1 : 0;
  }

  return history;
}