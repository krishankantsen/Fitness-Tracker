export interface GymEntry {
  _id?: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  attended: boolean;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MonthlyStats {
  totalDays: number;
  attendedDays: number;
  attendanceRate: number;
  currentStreak: number;
  longestStreak: number;
}