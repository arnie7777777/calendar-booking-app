'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { TimeSlot } from '@/types';
import BookingForm from './BookingForm';

interface TimeSlotPickerProps {
  date: Date;
}

export default function TimeSlotPicker({ date }: TimeSlotPickerProps) {
  const { data: session } = useSession();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!session?.accessToken) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const response = await fetch(`/api/availability?date=${formattedDate}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch available time slots');
        }
        
        const data = await response.json();
        setTimeSlots(data.timeSlots);
      } catch (err) {
        setError('Failed to load available time slots. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, [date, session?.accessToken]);
  
  if (!session) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-700">Please sign in to view and book available times.</p>
      </div>
    );
  }
  
  if (loading) {
    return <div className="text-center py-8">Loading available times...</div>;
  }
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }
  
  if (timeSlots.length === 0) {
    return <div className="text-center py-8">No time slots available for this date.</div>;
  }
  
  if (selectedSlot) {
    return (
      <BookingForm 
        date={date} 
        selectedSlot={selectedSlot} 
        onCancel={() => setSelectedSlot(null)} 
      />
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {timeSlots.map((slot, index) => (
        <button
          key={index}
          disabled={!slot.available}
          onClick={() => slot.available && setSelectedSlot(slot)}
          className={`
            py-2 px-3 rounded-md text-sm font-medium
            ${
              slot.available
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }
          `}
        >
          {slot.startTime} - {slot.endTime}
        </button>
      ))}
    </div>
  );
} 