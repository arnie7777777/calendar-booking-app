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
    // Add confetti effect when the page loads
    const showConfetti = async () => {
      if (dateParam && startParam && endParam) {
        try {
          const confetti = (await import('canvas-confetti')).default;
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.error('Failed to load confetti', e);
        }
      }
    };
    showConfetti();
  }, [dateParam, startParam, endParam]);
  
  if (!dateParam || !startParam || !endParam) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 p-6 rounded-xl max-w-md border border-red-200 dark:border-red-800/30 shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 dark:bg-red-800/50 p-2 rounded-full mr-3">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-red-800 dark:text-red-300">Invalid Booking Details</h1>
          </div>
          <p className="text-red-700 dark:text-red-300 mb-4">We couldn't find details about your booking. Please return to the calendar to try again.</p>
          <Link 
            href="/" 
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-full transition-all duration-200 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Calendar
          </Link>
        </div>
      </div>
    );
  }
  
  const date = parse(dateParam, 'yyyy-MM-dd', new Date());
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/10 rounded-full"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/10 rounded-full"></div>
        
        <div className="relative">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-green-600 dark:text-green-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Booking Confirmed!
          </h1>
          
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Your appointment has been scheduled successfully.
          </p>
          
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-5 rounded-lg mb-8 border border-gray-200 dark:border-gray-700/50 shadow-sm">
            <div className="mb-4">
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Date & Time
                </h2>
              </div>
              <p className="text-gray-900 dark:text-gray-100 font-medium text-lg ml-6">
                {format(date, 'EEEE, MMMM do, yyyy')}
              </p>
              <p className="text-gray-800 dark:text-gray-200 ml-6 flex items-center">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {startParam} - {endParam}
              </p>
            </div>
            
            <div>
              <div className="flex items-center mb-1">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Location
                </h2>
              </div>
              <p className="text-gray-800 dark:text-gray-200 ml-6">
                Google Meet <span className="text-sm text-gray-500 dark:text-gray-400">(link will be sent in calendar invitation)</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Link 
              href="/" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-md text-center shadow-sm hover:shadow transition-all duration-200 font-medium"
            >
              Return to Calendar
            </Link>
            
            <a
              href="https://calendar.google.com/calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white hover:bg-gray-50 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 py-2.5 px-4 rounded-md text-center border border-gray-300 dark:border-gray-600 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View in Google Calendar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 