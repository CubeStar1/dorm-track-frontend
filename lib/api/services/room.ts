import { AxiosResponse } from 'axios';
import { api } from '../axios';
import { Room } from './rooms';

export interface Roommate {
  user_id: string;
  student_id: string;
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
}

export const roomService = {
  async getRoomDetails(roomNumber?: string, userId?: string): Promise<Room & { roommates?: Roommate[] }> {
    if (userId) {
      const response: AxiosResponse<Room & { roommates?: Roommate[] }> = await api.get(`/api/user/room?userId=${userId}`);
      return response.data;
    }
    
    if (roomNumber) {
      const response: AxiosResponse<Room & { roommates?: Roommate[] }> = await api.get(`/api/rooms/${roomNumber}`);
      return response.data;
    }

    throw new Error('Either roomNumber or userId must be provided');
  }
}; 