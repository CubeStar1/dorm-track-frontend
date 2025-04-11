'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BedDoubleIcon, 
  UsersIcon, 
  BuildingIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  GraduationCapIcon,
  UserIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from 'lucide-react';
import { roomService } from '@/lib/api/services/rooms';
import CustomButton from '@/components/ui/custom-button';

export default function MyRoomPage() {
  const { data: room, isLoading, error } = useQuery({
    queryKey: ['my-room'],
    queryFn: () => roomService.getMyRoom(),
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2Icon className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">No room assigned</h1>
        <p className="text-gray-500 mb-6">Please contact hostel administration for room allocation.</p>
        <Link href="/dashboard">
          <CustomButton variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </CustomButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard">
          <CustomButton variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Dashboard
          </CustomButton>
        </Link>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
            room.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            <CheckCircleIcon className="w-4 h-4" />
            Your Room
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main content */}
        <div className="col-span-2 space-y-6">
          {/* Image gallery */}
          <div className="aspect-[16/9] relative rounded-2xl overflow-hidden">
            <Image
              src={room.images[0]}
              alt={`Room ${room.room_number}`}
              fill
              className="object-cover"
            />
          </div>

          {/* Room details */}
          <div className="bg-white rounded-2xl p-6 border divide-y space-y-6">
            <div className="pb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Room {room.room_number}</h1>
                <div className="text-sm text-gray-500">
                  {room.hostel.name} • Block {room.block}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <BedDoubleIcon className="w-5 h-5 text-gray-400" />
                  <span>{room.room_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-gray-400" />
                  <span>{room.current_occupancy}/{room.capacity} Occupied</span>
                </div>
                <div className="flex items-center gap-2">
                  <BuildingIcon className="w-5 h-5 text-gray-400" />
                  <span>Floor {room.floor}</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <h2 className="font-medium mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                {room.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <h2 className="font-medium mb-3">Description</h2>
              <p className="text-gray-600">
                {room.description}
              </p>
            </div>

            <div className="pt-6">
              <h2 className="font-medium mb-3">Hostel Information</h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{room.hostel.address}, {room.hostel.city}, {room.hostel.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{room.hostel.contact_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon className="w-4 h-4" />
                  <span>{room.hostel.contact_email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Room Occupants section */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl p-6 border sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Room Occupants</h2>
            
            {room.roommates && room.roommates.length > 0 ? (
              <div className="space-y-4">
                {room.roommates.map((roommate) => (
                  <div 
                    key={roommate.id} 
                    className={`p-4 border rounded-lg space-y-2 ${
                      roommate.is_you ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{roommate.full_name}</span>
                      </div>
                      {roommate.is_you && (
                        <span className="text-xs text-blue-600 font-medium">You</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                        {roommate.student_id}
                      </span>
                    </div>
                    {roommate.department && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <GraduationCapIcon className="w-4 h-4" />
                        <span>{roommate.department} • Year {roommate.year_of_study}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MailIcon className="w-4 h-4" />
                      <span>{roommate.email}</span>
                    </div>
                    {roommate.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <PhoneIcon className="w-4 h-4" />
                        <span>{roommate.phone}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No other occupants</p>
            )}

            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-500 text-center">
                Contact hostel administration for any room-related queries
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 