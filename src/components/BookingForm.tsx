'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TimeSlot, BookingFormData } from '@/types';
import { toast } from 'react-hot-toast';

interface BookingFormProps {
  date: Date;
  selectedSlot: TimeSlot;
  onCancel: () => void;
}

export default function BookingForm({ date, selectedSlot, onCancel }: BookingFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    notes: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.accessToken) {
      toast.error('You must be signed in to book an appointment');
      return;
    }
    
    setLoading(true);
    
    try {
      const bookingData: BookingFormData = {
        name: formData.name || '',
        email: formData.email || '',
        date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        notes: formData.notes,
      };
      
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }
      
      toast.success('Your appointment has been booked successfully!');
      
      // Redirect to confirmation page or reload to show updated calendar
      router.push(`/confirmation?date=${format(date, 'yyyy-MM-dd')}&start=${selectedSlot.startTime}&end=${selectedSlot.endTime}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Book Appointment
      </h3>
      
      <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
        <p className="text-blue-800 dark:text-blue-300 font-medium">
          {format(date, 'EEEE, MMMM do, yyyy')}
        </p>
        <p className="text-blue-600 dark:text-blue-400">
          {selectedSlot.startTime} - {selectedSlot.endTime}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Your Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div>
          <label 
            htmlFor="notes" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes || ''}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
} 