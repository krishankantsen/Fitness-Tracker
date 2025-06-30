'use client';

import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { StatsCard } from '@/components/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGymEntries } from '@/hooks/useGymEntries';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Zap, 
  ChevronLeft, 
  ChevronRight,
  BarChart3
} from 'lucide-react';
import { format, subMonths, addMonths } from 'date-fns';

export default function Stats() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStr = format(currentDate, 'yyyy-MM');
  const { stats, entries, loading } = useGymEntries(monthStr);

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const recentEntries = entries.slice(0, 5);

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Statistics
            </h1>
            <p className="text-gray-600">
              Detailed insights into your fitness journey
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 text-sm font-medium bg-white rounded-md border">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
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
          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Monthly Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Workout Days</span>
                  <span className="text-2xl font-bold text-green-600">
                    {stats?.attendedDays || 0}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-600 to-emerald-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stats?.attendanceRate || 0}%` 
                    }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>0 days</span>
                  <span>{stats?.totalDays || 0} days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentEntries.length > 0 ? (
                  recentEntries.map((entry) => (
                    <div
                      key={entry._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          entry.attended ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {format(new Date(entry.date), 'MMM dd, yyyy')}
                          </p>
                          {entry.reason && (
                            <p className="text-xs text-gray-600 truncate max-w-48">
                              {entry.reason}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        entry.attended 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.attended ? 'Attended' : 'Missed'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No workout entries found for this month</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}