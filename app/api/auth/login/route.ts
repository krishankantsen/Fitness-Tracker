import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { verifyPassword, generateToken } from '@/lib/auth';
import { User } from '../../../../lib/models/User'; // make sure you have this type

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Missing email or password' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('gym-tracker');
    const users = db.collection<User>('users');

    const user = await users.findOne<User>({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await users.updateOne(
      { _id: user._id },
      { $set: { lastLogin: new Date() } }
    );

    // convert _id to string before using
    const safeUser = {
      ...user,
      _id: user._id?.toString(),
    };

    const token = generateToken(safeUser);

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id?.toString(),
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
