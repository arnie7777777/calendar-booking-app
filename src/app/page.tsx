import CalendarView from '@/components/CalendarView';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Book a Meeting
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Select a date and time that works for you, and I'll send you a Google Meet link for our conversation.
            </p>
          </div>
          
          <CalendarView />
        </div>
      </main>
      
      <footer className="py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Booking Calendar App. Powered by Next.js and Google Calendar.
        </div>
      </footer>
    </div>
  );
}
