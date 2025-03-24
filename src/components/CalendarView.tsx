'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import TimeSlotPicker from './TimeSlotPicker';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const handleDateChange = (value: Value) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
          Select a Date
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Calendar 
              onChange={handleDateChange} 
              value={selectedDate}
              minDate={new Date()}
              className="w-full"
            />
          </div>
          
          <div>
            {selectedDate ? (
              <div>
                <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300">
                  Available times for {format(selectedDate, 'EEEE, MMMM do, yyyy')}
                </h3>
                <TimeSlotPicker date={selectedDate} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Please select a date to view available time slots
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 