import { Room } from './rooms';

export interface DashboardUser {
  id: string;
  full_name: string;
  email: string;
  student_id: string;
  department?: string;
  year_of_study?: number;
}

export interface DashboardData {
  user: DashboardUser;
  room: Room | null;
}

export const dashboardService = {
  async getDashboardData(): Promise<DashboardData> {
    const response = await fetch('/api/dashboard');
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data');
    }
    return response.json();
  }
}; 