import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
  }
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface DaySchedule {
  date: string;
  timeSlots: TimeSlot[];
}

export interface BookingFormData {
  name: string;
  email: string;
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees?: {
    email: string;
    displayName?: string;
  }[];
} 