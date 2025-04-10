'use client';

import { useState } from 'react';
import { XIcon } from 'lucide-react';

interface Filters {
  block?: string;
  floor?: number;
  room_type?: string;
  amenities?: string[];
  status?: 'available' | 'occupied' | 'maintenance';
}

interface RoomFiltersProps {
  onClose: () => void;
  initialFilters: Filters;
  onApply: (filters: Filters) => void;
}

export default function RoomFilters({ onClose, initialFilters, onApply }: RoomFiltersProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const handleBlockClick = (block: string) => {
    setFilters(prev => ({
      ...prev,
      block: prev.block === block ? undefined : block
    }));
  };

  const handleTypeClick = (type: string) => {
    setFilters(prev => ({
      ...prev,
      room_type: prev.room_type === type ? undefined : type
    }));
  };

  const handleFloorClick = (floor: number) => {
    setFilters(prev => ({
      ...prev,
      floor: prev.floor === floor ? undefined : floor
    }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...(prev.amenities || []), amenity]
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: Filters = { status: 'available' };
    setFilters(clearedFilters);
    onApply(clearedFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Block filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Block</h3>
            <div className="grid grid-cols-4 gap-2">
              {['A', 'B', 'C', 'D'].map((block) => (
                <button
                  key={block}
                  onClick={() => handleBlockClick(block)}
                  className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                    filters.block === block
                      ? 'border-black bg-black text-white'
                      : 'hover:border-black'
                  }`}
                >
                  Block {block}
                </button>
              ))}
            </div>
          </div>

          {/* Room type filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Room Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Single Sharing', 'Double Sharing', 'Triple Sharing'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeClick(type)}
                  className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                    filters.room_type === type
                      ? 'border-black bg-black text-white'
                      : 'hover:border-black'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Floor filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Floor</h3>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5].map((floor) => (
                <button
                  key={floor}
                  onClick={() => handleFloorClick(floor)}
                  className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                    filters.floor === floor
                      ? 'border-black bg-black text-white'
                      : 'hover:border-black'
                  }`}
                >
                  Floor {floor}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Air Conditioning',
                'Balcony',
                'Extra Storage',
                'Corner Room',
                'Mountain View',
                'Garden View',
              ].map((amenity) => (
                <label
                  key={amenity}
                  className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                    filters.amenities?.includes(amenity)
                      ? 'border-black bg-black text-white'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={filters.amenities?.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                  />
                  <span className="text-sm">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-white sticky bottom-0">
          <button
            onClick={handleClear}
            className="px-6 py-2 text-sm font-medium text-gray-700 hover:underline"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
} 