export type Habit = {
  id: string;
  title: string;
  history: Record<string, boolean>;
  showGrid?: boolean;
};