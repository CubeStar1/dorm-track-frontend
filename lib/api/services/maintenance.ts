export interface MaintenanceRequest {
  id: string;
  hostel_id: string;
  student_id: string;
  room_id: string;
  issue_type: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to?: {
    id: string;
    full_name: string;
    email: string;
  };
  hostel: {
    id: string;
    name: string;
  };
  room: {
    id: string;
    room_number: string;
  };
  created_at: string;
  updated_at: string;
}

export const maintenanceService = {
  async getRequest(id: string): Promise<MaintenanceRequest> {
    const response = await fetch(`/api/maintenance/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance request');
    }
    return response.json();
  },

  async getRequests(): Promise<MaintenanceRequest[]> {
    const response = await fetch('/api/maintenance');
    if (!response.ok) {
      throw new Error('Failed to fetch maintenance requests');
    }
    return response.json();
  },

  async updateRequestStatus(id: string, status: MaintenanceRequest['status']): Promise<void> {
    const response = await fetch(`/api/maintenance/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update maintenance request status');
    }
  }
}; 