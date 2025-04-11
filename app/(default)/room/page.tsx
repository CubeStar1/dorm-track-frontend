'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/lib/api/services/room';
import type { Room } from '@/lib/api/services/rooms';
import type { Roommate } from '@/lib/api/services/room';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';

export default function RoomPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      // Redirect to login if no user ID is found
      router.push('/login');
      return;
    }
    setUserId(storedUserId);
  }, [router]);

  const { data: room, isLoading, error } = useQuery({
    queryKey: ['room', userId],
    queryFn: () => roomService.getRoomDetails(undefined, userId!),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">Failed to fetch room details</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mx-auto p-4">
        <div>No room assigned</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Room Details</h1>
      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Room Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Room Number</p>
                <p className="font-medium">{room.room_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hostel</p>
                <p className="font-medium">{room.hostel?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">{room.capacity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge variant={room.status === 'available' ? 'default' : 'secondary'}>
                  {room.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {room.roommates && room.roommates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Roommates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {room.roommates.map((roommate: Roommate) => (
                  <div key={roommate.user_id} className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${roommate.user.full_name}`} />
                      <AvatarFallback>{roommate.user.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{roommate.user.full_name}</p>
                      <p className="text-sm text-gray-500">{roommate.user.email}</p>
                      <p className="text-sm text-gray-500">{roommate.user.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 