'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Tag,
  ChevronRight,
  Loader2Icon,
  PartyPopper,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { eventsService } from '@/lib/api/services/events';
import type { Event, EventCategory } from '@/lib/api/services/events';

const CATEGORY_LABELS: Record<EventCategory, string> = {
  cultural: 'Cultural',
  sports: 'Sports',
  academic: 'Academic',
  social: 'Social',
  other: 'Other'
};

const CATEGORY_COLORS: Record<EventCategory, { bg: string; text: string }> = {
  cultural: { bg: 'bg-pink-100', text: 'text-pink-700' },
  sports: { bg: 'bg-blue-100', text: 'text-blue-700' },
  academic: { bg: 'bg-purple-100', text: 'text-purple-700' },
  social: { bg: 'bg-green-100', text: 'text-green-700' },
  other: { bg: 'bg-gray-100', text: 'text-gray-700' }
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'text-blue-600',
  ongoing: 'text-green-600',
  completed: 'text-gray-600',
  cancelled: 'text-red-600'
};

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: eventsService.getEvents,
  });

  const filteredEvents = events.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || event.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const upcomingEvents = filteredEvents.filter(event => event.status === 'upcoming');
  const otherEvents = filteredEvents.filter(event => event.status !== 'upcoming');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground mt-1">
              Discover and register for upcoming events
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2Icon className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <PartyPopper className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No events found</h2>
            <p className="text-muted-foreground">
              {selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Check back later for upcoming events'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Other Events */}
            {otherEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-4">Past & Ongoing Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherEvents.map((event, index) => (
                    <EventCard key={event.id} event={event} index={index} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/events/${event.id}`}>
        <Card className="h-full hover:shadow-lg transition-shadow">
          {event.image_url && (
            <div className="relative h-48 w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.image_url}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
            </div>
          )}
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                CATEGORY_COLORS[event.category].bg
              } ${CATEGORY_COLORS[event.category].text}`}>
                {CATEGORY_LABELS[event.category]}
              </div>
              <span className={`text-sm font-medium capitalize ${STATUS_COLORS[event.status]}`}>
                {event.status}
              </span>
            </div>
            <CardTitle className="line-clamp-2">{event.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {event.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(event.event_date), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(event.event_date), 'p')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
              {event.max_participants && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {event.registrations_count} / {event.max_participants} registered
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="secondary"
              className="w-full mt-4"
            >
              View Details
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
} 