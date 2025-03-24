import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createCalendarEvent } from '@/utils/calendar';
import { BookingFormData } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const bookingData: BookingFormData = await request.json();
    
    if (!bookingData.name || !bookingData.email || !bookingData.date || !bookingData.startTime || !bookingData.endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const event = await createCalendarEvent(
      session.accessToken,
      bookingData
    );
    
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
} 