import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAvailableTimeSlots } from '@/utils/calendar';
import { parse } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const dateString = searchParams.get('date');
    
    if (!dateString) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }
    
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    
    const timeSlots = await getAvailableTimeSlots(
      session.accessToken,
      date,
      9, // Start hour
      17, // End hour
      30  // Slot duration in minutes
    );
    
    return NextResponse.json({ timeSlots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 });
  }
} 