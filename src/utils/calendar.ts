import { google } from 'googleapis';
import { BookingFormData, CalendarEvent, DaySchedule, TimeSlot } from '@/types';
import { format, addMinutes, parse, isAfter, isBefore, setHours, setMinutes } from 'date-fns';

const CALENDAR_ID = 'primary';
const TIME_ZONE = 'America/New_York';

// Create a Google Calendar API client
export const getGoogleCalendarClient = (accessToken: string) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });
  
  return google.calendar({ version: 'v3', auth });
};

// Get available time slots for a specific date
export const getAvailableTimeSlots = async (
  accessToken: string,
  date: Date,
  startHour = 9,
  endHour = 17,
  slotDuration = 30
): Promise<TimeSlot[]> => {
  const calendar = getGoogleCalendarClient(accessToken);
  
  // Set the start and end times for the day
  const startTime = setHours(setMinutes(date, 0), startHour);
  const endTime = setHours(setMinutes(date, 0), endHour);
  
  // Get existing events for the day
  const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: startTime.toISOString(),
    timeMax: endTime.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });
  
  const events = response.data.items as CalendarEvent[];
  
  // Generate all possible time slots
  let currentSlot = startTime;
  const allSlots: TimeSlot[] = [];
  
  while (isBefore(currentSlot, endTime)) {
    const slotEndTime = addMinutes(currentSlot, slotDuration);
    
    if (!isBefore(slotEndTime, endTime)) {
      break;
    }
    
    allSlots.push({
      startTime: format(currentSlot, 'HH:mm'),
      endTime: format(slotEndTime, 'HH:mm'),
      available: true,
    });
    
    currentSlot = slotEndTime;
  }
  
  // Mark slots as unavailable if they overlap with events
  events.forEach((event) => {
    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);
    
    allSlots.forEach((slot) => {
      const slotStart = parse(`${format(date, 'yyyy-MM-dd')} ${slot.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
      const slotEnd = parse(`${format(date, 'yyyy-MM-dd')} ${slot.endTime}`, 'yyyy-MM-dd HH:mm', new Date());
      
      // Check if this slot overlaps with the event
      if (
        (isAfter(eventStart, slotStart) && isBefore(eventStart, slotEnd)) ||
        (isAfter(eventEnd, slotStart) && isBefore(eventEnd, slotEnd)) ||
        (isBefore(eventStart, slotStart) && isAfter(eventEnd, slotEnd)) ||
        (isBefore(eventStart, slotEnd) && isAfter(eventEnd, slotStart))
      ) {
        slot.available = false;
      }
    });
  });
  
  return allSlots;
};

// Create a calendar event
export const createCalendarEvent = async (
  accessToken: string,
  bookingData: BookingFormData
): Promise<CalendarEvent> => {
  const calendar = getGoogleCalendarClient(accessToken);
  
  const { date, startTime, endTime, name, email, notes } = bookingData;
  
  const eventStartDate = parse(`${format(date, 'yyyy-MM-dd')} ${startTime}`, 'yyyy-MM-dd HH:mm', new Date());
  const eventEndDate = parse(`${format(date, 'yyyy-MM-dd')} ${endTime}`, 'yyyy-MM-dd HH:mm', new Date());
  
  const event = {
    summary: `Meeting with ${name}`,
    description: notes || 'Calendar booking via our scheduling app',
    start: {
      dateTime: eventStartDate.toISOString(),
      timeZone: TIME_ZONE,
    },
    end: {
      dateTime: eventEndDate.toISOString(),
      timeZone: TIME_ZONE,
    },
    attendees: [
      { email },
    ],
    reminders: {
      useDefault: true,
    },
  };
  
  const response = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: event,
    sendUpdates: 'all',
  });
  
  return response.data as CalendarEvent;
}; 