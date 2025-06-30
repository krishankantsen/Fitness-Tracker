import { NextRequest } from 'next/server';
import { verifyToken } from './auth';

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Also check cookies as fallback
  const cookieToken = request.cookies.get('auth-token')?.value;
  return cookieToken || null;
}

export function getUserFromRequest(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  
  return verifyToken(token);
}