import { AxiosResponse } from 'axios';
import { api } from '../axios';

export interface Hostel {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  contact_email: string;
  contact_phone: string;
  total_blocks: number;
  total_rooms: number;
}

export interface Room {
  id: string;
  hostel_id: string;
  hostel: Hostel;
  room_number: string;
  block: string;
  floor: number;
  capacity: number;
  current_occupancy: number;
  room_type: 'Single' | 'Double' | 'Triple';
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  price: number;
  description: string;
  images: string[];
}

export interface RoomFilters {
  block?: string;
  floor?: number;
  roomType?: Room['room_type'];
  amenities?: string[];
  status?: Room['status'];
  hostelId?: string;
}

export const roomService = {
  async getRooms(filters?: RoomFilters): Promise<Room[]> {
    const params = new URLSearchParams();
    
    if (filters?.block) params.append('block', filters.block);
    if (filters?.floor) params.append('floor', filters.floor.toString());
    if (filters?.roomType) params.append('roomType', filters.roomType);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.amenities?.length) params.append('amenities', filters.amenities.join(','));
    if (filters?.hostelId) params.append('hostelId', filters.hostelId);

    const response: AxiosResponse<Room[]> = await api.get(`/rooms?${params.toString()}`);
    return response.data;
  },

  async getRoom(roomNumber: string): Promise<Room> {
    const response: AxiosResponse<Room> = await api.get(`/rooms/${roomNumber}`);
    return response.data;
  },

  async bookRoom(roomId: string): Promise<void> {
    await api.post(`/rooms/${roomId}/book`);
  }
}; 