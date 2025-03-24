'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { parse, format } from 'date-fns';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const dateParam = searchParams.get('date');
  const startParam = searchParams.get('start');
  const endParam = searchParams.get('end');
  
  useEffect(() => {
    // Add to Google Calendar link generation could be done here if needed
  }, []);
  
  if (!dateParam || !startParam || !endParam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-md">
          <h1 className="text-xl font-bold mb-2">Invalid Confirmation</h1>
          <p>We couldn't find details about your booking. Please return to the calendar to try again.</p>
          <Link 
            href="/" 
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Return to Calendar
          </Link>
        </div>
      </div>
    );
  }
  
  const date = parse(dateParam, 'yyyy-MM-dd', new Date());
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-green-600 dark:text-green-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">
          Booking Confirmed!
        </h1>
        
        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
          Your appointment has been scheduled successfully.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-6">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              DATE & TIME
            </h2>
            <p className="text-gray-900 dark:text-gray-100 font-medium">
              {format(date, 'EEEE, MMMM do, yyyy')}
            </p>
            <p className="text-gray-900 dark:text-gray-100">
              {startParam} - {endParam}
            </p>
          </div>
          
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              LOCATION
            </h2>
            <p className="text-gray-900 dark:text-gray-100">
              Google Meet (link will be sent in calendar invitation)
            </p>
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          <Link 
            href="/" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md text-center transition-colors"
          >
            Return to Calendar
          </Link>
          
          <a
            href="https://calendar.google.com/calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md text-center border border-gray-300 dark:border-gray-600 transition-colors"
          >
            View in Google Calendar
          </a>
        </div>
      </div>
    </div>
  );
} 