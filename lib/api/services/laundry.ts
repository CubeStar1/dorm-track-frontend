export type LaundrySlotStatus = 'available' | 'booked' | 'in_progress'

interface User {
  full_name: string
  email: string
}

interface Student {
  user_id: string
  student_id: string
  user: User
}

interface Hostel {
  name: string
  code: string
}

export interface LaundrySlot {
  id: string
  hostel_id: string
  machine_number: number
  date: string
  time_slot: string
  status: LaundrySlotStatus
  student_id: string | null
  student?: Student
  hostel?: Hostel
  created_at: string
  updated_at: string
}

export interface CreateLaundrySlotPayload {
  machine_number: number
  date: string
  time_slot: string
}

export const laundryService = {
  async getSlots(): Promise<LaundrySlot[]> {
    const response = await fetch('/api/laundry')
    if (!response.ok) {
      throw new Error('Failed to fetch laundry slots')
    }
    return response.json()
  },

  async getSlot(id: string): Promise<LaundrySlot> {
    const response = await fetch(`/api/laundry/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch laundry slot')
    }
    return response.json()
  },

  async bookSlot(data: CreateLaundrySlotPayload): Promise<LaundrySlot> {
    const response = await fetch('/api/laundry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to book laundry slot')
    }
    return response.json()
  },

  async cancelBooking(id: string): Promise<LaundrySlot> {
    const response = await fetch(`/api/laundry/${id}`, {
      method: 'PATCH',
    })
    if (!response.ok) {
      throw new Error('Failed to cancel laundry booking')
    }
    return response.json()
  },
} 