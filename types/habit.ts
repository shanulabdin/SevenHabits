export type Reminder = {
  time: string;           // "HH:mm" format, e.g. "08:30"
  days: number[];         // 1=Sun, 2=Mon, ..., 7=Sat (Expo weekday format)
};

export type Habit = {
  id: string;
  title: string;
  history: Record<string, boolean>;
  showGrid?: boolean;
  showStreak?: boolean;
  reminder?: Reminder | null;
};