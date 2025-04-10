'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader } from 'lucide-react';

export default function RoomMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here you would typically initialize your map library (Google Maps, Mapbox, etc.)
    // For now, we'll just show a loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div ref={mapRef} className="h-full bg-gray-100">
      {/* Map placeholder - replace with actual map implementation */}
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>Map view will be implemented here</p>
      </div>
    </div>
  );
} 