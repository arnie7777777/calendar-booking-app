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
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-amber-900/20 dark:to-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-yellow-700 dark:text-yellow-400 font-medium text-sm">Please sign in with Google to view and book available times.</p>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-3 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
          <div className="w-3 h-3 bg-blue-400 dark:bg-blue-600 rounded-full animation-delay-200"></div>
          <div className="w-3 h-3 bg-blue-400 dark:bg-blue-600 rounded-full animation-delay-400"></div>
        </div>
        <p className="text-sm text-blue-500 dark:text-blue-400 mt-3">Loading available time slots...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800/30 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-700 dark:text-red-400 font-medium text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  if (timeSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-600 dark:text-gray-400 font-medium">No time slots available for this date.</p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Please select another date.</p>
      </div>
    );
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
  
  // Group time slots by morning, afternoon, evening
  const morningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 0 && hour < 12;
  });
  
  const afternoonSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 12 && hour < 17;
  });
  
  const eveningSlots = timeSlots.filter(slot => {
    const hour = parseInt(slot.startTime.split(':')[0]);
    return hour >= 17 && hour <= 23;
  });
  
  const renderTimeSlots = (slots: TimeSlot[], title: string, icon: React.ReactNode) => {
    if (slots.length === 0) return null;
    
    return (
      <div className="mb-4">
        <div className="flex items-center mb-2 text-gray-600 dark:text-gray-400">
          {icon}
          <h4 className="text-sm font-medium ml-2">{title}</h4>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slots.map((slot, index) => (
            <button
              key={index}
              disabled={!slot.available}
              onClick={() => slot.available && setSelectedSlot(slot)}
              className={`
                py-2 px-3 rounded-md text-sm font-medium transition-all duration-200
                ${
                  slot.available
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-400 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 border border-blue-200 dark:border-blue-700/30 shadow-sm hover:shadow'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed border border-gray-200 dark:border-gray-700'
                }
              `}
            >
              {slot.startTime} - {slot.endTime}
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-2">
      {renderTimeSlots(
        morningSlots, 
        'Morning', 
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
      {renderTimeSlots(
        afternoonSlots, 
        'Afternoon', 
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {renderTimeSlots(
        eveningSlots, 
        'Evening', 
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </div>
  );
} 