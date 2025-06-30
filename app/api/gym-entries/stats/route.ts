import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getUserFromRequest } from '@/lib/api-helpers';

export async function GET(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // YYYY-MM format

    const client = await clientPromise;
    const db = client.db('gym-tracker');
    const entries = db.collection('gym-entries');

    // Get entries for the specified month or current month
    const currentDate = new Date();
    const targetMonth = month || `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    const startDate = `${targetMonth}-01`;
    const endDate = `${targetMonth}-31`;

    const monthEntries = await entries.find({
      userId: user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 }).toArray();

    // Calculate stats
    const totalDays = monthEntries.length;
    const attendedDays = monthEntries.filter(entry => entry.attended).length;
    const attendanceRate = totalDays > 0 ? Math.round((attendedDays / totalDays) * 100) : 0;

    // Calculate current streak
    let currentStreak = 0;
    const sortedEntries = monthEntries.sort((a, b) => b.date.localeCompare(a.date));
    
    for (const entry of sortedEntries) {
      if (entry.attended) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak for the month
    let longestStreak = 0;
    let tempStreak = 0;
    
    for (const entry of monthEntries.sort((a, b) => a.date.localeCompare(b.date))) {
      if (entry.attended) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return NextResponse.json({
      stats: {
        totalDays,
        attendedDays,
        attendanceRate,
        currentStreak,
        longestStreak,
        month: targetMonth,
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}