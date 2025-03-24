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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full"></div>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 relative z-10">
          Select a Date & Time
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <div className="flex flex-col">
            <div className="p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                1. Select a date from the calendar
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-750 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <Calendar 
                onChange={handleDateChange} 
                value={selectedDate}
                minDate={new Date()}
                className="w-full"
                tileClassName={({ date }) => {
                  // Add a special class to today's date
                  if (date.toDateString() === new Date().toDateString()) {
                    return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
                  }
                  return '';
                }}
              />
            </div>
          </div>
          
          <div className="flex flex-col">
            <div className="p-4 bg-purple-50 dark:bg-gray-700/50 rounded-lg mb-4">
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                2. Choose an available time slot
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-750 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-full">
              {selectedDate ? (
                <div>
                  <h3 className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-300 flex items-center">
                    <span className="inline-block w-8 h-8 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 rounded-full flex items-center justify-center mr-2 text-sm">
                      {format(selectedDate, 'd')}
                    </span>
                    <span>{format(selectedDate, 'EEEE, MMMM do, yyyy')}</span>
                  </h3>
                  <TimeSlotPicker date={selectedDate} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-center font-medium">
                    Please select a date to view available times
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm text-center mt-2">
                    Times are shown in your local timezone
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 