'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { CalendarView } from '@/components/CalendarView';

export default function Calendar() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Workout Calendar
          </h1>
          <p className="text-gray-600">
            View your workout history and track your progress over time
          </p>
        </div>

        <CalendarView />
      </div>
    </div>
  );
}