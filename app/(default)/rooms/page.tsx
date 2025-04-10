'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapIcon, FilterIcon } from 'lucide-react';
import RoomCard from '@/components/rooms/RoomCard';
import RoomFilters from '@/components/rooms/RoomFilters';
import RoomMap from '@/components/rooms/RoomMap';
import CustomButton from '@/components/ui/custom-button';
import { roomService, RoomFilters as RoomFilterType } from '@/lib/api/services/rooms';

export default function RoomsPage() {
  const [showMap, setShowMap] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<RoomFilterType>({
    status: 'available',
  });

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms', filters],
    queryFn: () => roomService.getRooms(filters),
  });

  const handleFiltersChange = (newFilters: RoomFilterType) => {
    setFilters(newFilters);
  };

  return (
    <div className="h-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Available Rooms</h1>
          <p className="text-gray-600">Find and book your perfect room</p>
        </div>
        <div className="flex items-center gap-3">
          <CustomButton
            onClick={() => setShowFilters(true)}
            variant="outline"
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            Filters
          </CustomButton>
          <CustomButton
            onClick={() => setShowMap(!showMap)}
            variant={showMap ? 'primary' : 'outline'}
          >
            <MapIcon className="w-4 h-4 mr-2" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </CustomButton>
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100%-5rem)]">
        {/* Room grid */}
        <div className={`${showMap ? 'w-7/12' : 'w-full'} overflow-y-auto pr-2`}>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl aspect-[4/3] animate-pulse"
                />
              ))}
            </div>
          ) : rooms?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border">
              <p className="text-gray-500">No rooms found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rooms?.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </div>

        {/* Map */}
        {showMap && (
          <div className="w-5/12 rounded-xl overflow-hidden border bg-white">
            <RoomMap />
          </div>
        )}
      </div>

      {/* Filters modal */}
      {showFilters && (
        <RoomFilters
          onClose={() => setShowFilters(false)}
          initialFilters={filters}
          onApply={handleFiltersChange}
        />
      )}
    </div>
  );
} 