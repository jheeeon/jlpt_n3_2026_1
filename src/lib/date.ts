const EXAM_DATE = "2026-07-05";

export function getTodayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDaysUntilExam(today = new Date()): number {
  const todayStart = new Date(getTodayKey(today));
  const examStart = new Date(EXAM_DATE);
  const diff = examStart.getTime() - todayStart.getTime();
  return Math.ceil(diff / 86_400_000);
}

export function getExamDate(): string {
  return EXAM_DATE;
}
