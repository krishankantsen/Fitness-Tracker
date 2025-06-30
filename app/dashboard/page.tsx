'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { StatsCard } from '@/components/StatsCard';
import { useGymEntries } from '@/hooks/useGymEntries';
import { TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { stats, loading } = useGymEntries();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Navigation />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Track your fitness progress for {format(new Date(), 'MMMM yyyy')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Attendance Rate"
            value={`${stats?.attendanceRate || 0}%`}
            description="This month"
            icon={TrendingUp}
            gradient="from-green-600 to-emerald-600"
          />
          
          <StatsCard
            title="Days Attended"
            value={`${stats?.attendedDays || 0}/${stats?.totalDays || 0}`}
            description="This month"
            icon={Calendar}
            gradient="from-blue-600 to-cyan-600"
          />
          
          <StatsCard
            title="Current Streak"
            value={stats?.currentStreak || 0}
            description="Consecutive days"
            icon={Zap}
            gradient="from-orange-600 to-red-600"
          />
          
          <StatsCard
            title="Best Streak"
            value={stats?.longestStreak || 0}
            description="This month"
            icon={Target}
            gradient="from-purple-600 to-pink-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <a
                href="/track"
                className="block p-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Track Today's Workout</span>
                  <span className="text-blue-100">→</span>
                </div>
              </a>
              
              <a
                href="/calendar"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">View Calendar</span>
                  <span className="text-gray-400">→</span>
                </div>
              </a>
              
              <a
                href="/stats"
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">View Statistics</span>
                  <span className="text-gray-400">→</span>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Motivational Tip
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
              <p className="text-gray-700 font-medium mb-2">
                "The best project you&apos;ll ever work on is you."
              </p>
              <p className="text-sm text-gray-600">
                Consistency is key to achieving your fitness goals. Every workout counts, 
                no matter how small. Keep showing up for yourself!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}