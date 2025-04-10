'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BedDoubleIcon, 
  UsersIcon, 
  BuildingIcon, 
  ArrowLeftIcon,
  Loader2Icon,
  MapPinIcon,
  PhoneIcon,
  MailIcon
} from 'lucide-react';
import CustomButton from '@/components/ui/custom-button';
import { roomService } from '@/lib/api/services/rooms';

export default function RoomDetailPage() {
  const { roomNumber } = useParams();

  const { data: room, isLoading } = useQuery({
    queryKey: ['room', roomNumber],
    queryFn: () => roomService.getRoom(roomNumber as string),
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2Icon className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mb-4">Room not found</h1>
        <Link href="/rooms">
          <CustomButton variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to rooms
          </CustomButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back button */}
      <div className="mb-8">
        <Link href="/rooms">
          <CustomButton variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to rooms
          </CustomButton>
        </Link>
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
                  <span>{room.capacity} Person</span>
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

        {/* Booking card */}
        <div className="col-span-1">
          <div className="bg-white rounded-2xl p-6 border sticky top-4 divide-y">
            <div className="pb-4">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="text-2xl font-semibold">₹{room.price.toLocaleString()}</h2>
                <span className="text-gray-500">per semester</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Status</span>
                  <span className={`font-medium ${
                    room.status === 'available' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span>Current Occupancy</span>
                  <span>{room.current_occupancy}/{room.capacity}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <CustomButton
                variant={room.status === 'available' ? 'primary' : 'outline'}
                disabled={room.status !== 'available'}
                fullWidth
              >
                {room.status === 'available' ? 'Book Now' : 'Not Available'}
              </CustomButton>

              <p className="text-xs text-gray-500 text-center">
                Contact hostel administration for booking assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 