'use client';

import { DashboardData } from '@/lib/api/services/dashboard';
import { BedDoubleIcon, DoorClosedIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: DashboardData['room'];
  className?: string;
}

export function RoomCard({ room, className }: RoomCardProps) {
  if (!room) {
    return (
      <div className={cn(
        "bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow",
        className
      )}>
        <h2 className="text-lg font-semibold mb-4">Room Assignment</h2>
        <div className="text-gray-600">
          <p>You have not been assigned to a room yet.</p>
          <p className="mt-2">Please contact the hostel administration for assistance.</p>
        </div>
      </div>
    );
  }

  const roommates = room.roommates || [];
  const occupantCount = roommates.length;
  const otherRoommates = roommates.filter(r => !r.is_you);

  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Room</h2>
        <Button variant="outline" size="sm" asChild>
          <Link href="/my-room">View Details</Link>
        </Button>
      </div>
      
      <div className="grid gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-blue-50">
            <DoorClosedIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Room {room.room_number}</p>
            <p className="text-sm text-gray-600">Block {room.block} • Floor {room.floor}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-green-50">
            <BedDoubleIcon className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Occupancy</p>
            <p className="text-sm text-gray-600">
              {occupantCount} occupant{occupantCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-purple-50">
            <UsersIcon className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-medium">Roommates</p>
            <p className="text-sm text-gray-600">
              {otherRoommates.length > 0 
                ? otherRoommates.map(r => r.full_name).join(', ')
                : 'No roommates yet'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 