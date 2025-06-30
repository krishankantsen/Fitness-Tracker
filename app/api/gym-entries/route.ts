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
    const year = searchParams.get('year');

    const client = await clientPromise;
    const db = client.db('gym-tracker');
    const entries = db.collection('gym-entries');

    let query: any = { userId: user.id };

    if (month) {
      const startDate = `${month}-01`;
      const endDate = `${month}-31`;
      query.date = { $gte: startDate, $lte: endDate };
    } else if (year) {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query.date = { $gte: startDate, $lte: endDate };
    }

    const gymEntries = await entries.find(query).sort({ date: -1 }).toArray();

    return NextResponse.json({
      entries: gymEntries.map(entry => ({
        ...entry,
        _id: entry._id.toString(),
      })),
    });

  } catch (error) {
    console.error('Get entries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { date, attended, reason } = await request.json();

    if (!date || attended === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('gym-tracker');
    const entries = db.collection('gym-entries');

    // Check if entry already exists for this date
    const existingEntry = await entries.findOne({ userId: user.id, date });
    
    const entryData = {
      userId: user.id,
      date,
      attended,
      reason: reason || '',
      updatedAt: new Date(),
    };

    if (existingEntry) {
      // Update existing entry
      await entries.updateOne(
        { _id: existingEntry._id },
        { $set: entryData }
      );
      
      return NextResponse.json({
        message: 'Entry updated successfully',
        entry: { ...entryData, _id: existingEntry._id.toString() },
      });
    } else {
      // Create new entry
      const newEntry = {
        ...entryData,
        createdAt: new Date(),
      };
      
      const result = await entries.insertOne(newEntry);
      
      return NextResponse.json({
        message: 'Entry created successfully',
        entry: { ...newEntry, _id: result.insertedId.toString() },
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Create/Update entry error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}