'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface GymEntry {
  _id: string;
  userId: string;
  date: string;
  attended: boolean;
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlyStats {
  totalDays: number;
  attendedDays: number;
  attendanceRate: number;
  currentStreak: number;
  longestStreak: number;
  month: string;
}

export function useGymEntries(month?: string) {
  const { token } = useAuth();
  const [entries, setEntries] = useState<GymEntry[]>([]);
  const [stats, setStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const params = month ? `?month=${month}` : '';
      const response = await fetch(`/api/gym-entries${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!token) return;

    try {
      const params = month ? `?month=${month}` : '';
      const response = await fetch(`/api/gym-entries/stats${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const saveEntry = async (date: string, attended: boolean, reason?: string) => {
    if (!token) return false;

    try {
      const response = await fetch('/api/gym-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ date, attended, reason }),
      });

      if (response.ok) {
        fetchEntries();
        fetchStats();
        return true;
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    }
    
    return false;
  };

  useEffect(() => {
    fetchEntries();
    fetchStats();
  }, [token, month]);

  return {
    entries,
    stats,
    loading,
    saveEntry,
    refetch: () => {
      fetchEntries();
      fetchStats();
    },
  };
}