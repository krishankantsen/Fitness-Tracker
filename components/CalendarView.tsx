'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGymEntries } from '@/hooks/useGymEntries';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStr = format(currentDate, 'yyyy-MM');
  const { entries, loading } = useGymEntries(monthStr);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntryForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return entries.find(entry => entry.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get the starting day of the week for the month
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // Create array of all days to display (including prev/next month days)
  const calendarDays = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    calendarDays.push(day);
  }

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="h-8 flex items-center justify-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                const entry = getEntryForDate(day);
                const isCurrentMonth = isSameMonth(day, currentDate);
                const isTodayDate = isToday(day);
                
                return (
                  <div
                    key={index}
                    className={cn(
                      'h-12 flex items-center justify-center relative rounded-lg transition-all duration-200',
                      !isCurrentMonth && 'text-gray-300',
                      isTodayDate && 'ring-2 ring-blue-600',
                      entry?.attended && 'bg-gradient-to-br from-green-100 to-emerald-100',
                      entry?.attended === false && 'bg-gradient-to-br from-red-100 to-pink-100',
                      !entry && isCurrentMonth && 'hover:bg-gray-50'
                    )}
                  >
                    <span className={cn(
                      'text-sm font-medium',
                      isTodayDate && 'font-bold text-blue-600'
                    )}>
                      {format(day, 'd')}
                    </span>
                    
                    {entry && (
                      <div className="absolute -top-1 -right-1">
                        {entry.attended ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded border border-green-200"></div>
                <span className="text-sm text-gray-600">Went to gym</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gradient-to-br from-red-100 to-pink-100 rounded border border-red-200"></div>
                <span className="text-sm text-gray-600">Missed gym</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-50 rounded border border-gray-200"></div>
                <span className="text-sm text-gray-600">No entry</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}