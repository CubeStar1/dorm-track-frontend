import Image from 'next/image';
import Link from 'next/link';
import { Room } from '@/lib/api/services/rooms';
import { BedDoubleIcon, CheckCircleIcon, XCircleIcon, BuildingIcon, MapPinIcon } from 'lucide-react';

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <Link href={`/rooms/${room.room_number}`}>
      <div className="group bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-[4/3]">
          {room.images?.[0] ? (
            <Image
              src={room.images[0]}
              alt={`Room ${room.room_number}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <BedDoubleIcon className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            {room.status === 'available' ? (
              <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                <CheckCircleIcon className="w-3 h-3" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                <XCircleIcon className="w-3 h-3" />
                {room.status === 'maintenance' ? 'Maintenance' : 'Occupied'}
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Room {room.room_number}</h3>
            <p className="text-sm text-gray-500">Block {room.block}</p>
          </div>

          {room.hostel && (
            <div className="flex flex-col gap-1 mb-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BuildingIcon className="w-4 h-4" />
                <span>{room.hostel.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4" />
                <span>{room.hostel.address}</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <BedDoubleIcon className="w-4 h-4" />
            <span className="text-sm">{room.room_type} ({room.current_occupancy}/{room.capacity})</span>
          </div>

          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {room.amenities.map((amenity) => (
                <span
                  key={amenity}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
                >
                  {amenity}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">₹{room.price.toLocaleString()}</p>
            <p className="text-sm text-gray-500">per semester</p>
          </div>
        </div>
      </div>
    </Link>
  );
} 