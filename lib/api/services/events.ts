export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
export type EventCategory = 'cultural' | 'sports' | 'academic' | 'social' | 'other'
export type RegistrationStatus = 'registered' | 'attended' | 'cancelled'

interface User {
  id: string
  full_name: string
  email: string
}

export interface Event {
  id: string
  institution_id: string
  title: string
  description: string
  event_date: string
  location: string
  max_participants: number | null
  registration_deadline: string | null
  image_url: string | null
  organizer_id: string
  category: EventCategory
  status: EventStatus
  created_at: string
  updated_at: string
  organizer?: User
  registrations_count?: number
  is_registered?: boolean
}

export interface EventRegistration {
  id: string
  event_id: string
  student_id: string
  status: RegistrationStatus
  created_at: string
  updated_at: string
  student?: {
    user_id: string
    student_id: string
    user: User
  }
}

export interface CreateEventPayload {
  title: string
  description: string
  event_date: string
  location: string
  max_participants?: number
  registration_deadline?: string
  image_url?: string
  category: EventCategory
}

export const eventsService = {
  async getEvents(): Promise<Event[]> {
    const response = await fetch('/api/events')
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    return response.json()
  },

  async getEvent(id: string): Promise<Event> {
    const response = await fetch(`/api/events/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch event')
    }
    return response.json()
  },

  async createEvent(data: CreateEventPayload): Promise<Event> {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create event')
    }
    return response.json()
  },

  async registerForEvent(eventId: string): Promise<EventRegistration> {
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to register for event')
    }
    return response.json()
  },

  async cancelRegistration(eventId: string): Promise<EventRegistration> {
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to cancel registration')
    }
    return response.json()
  },

  async getEventRegistrations(eventId: string): Promise<EventRegistration[]> {
    const response = await fetch(`/api/events/${eventId}/registrations`)
    if (!response.ok) {
      throw new Error('Failed to fetch event registrations')
    }
    return response.json()
  },
} 