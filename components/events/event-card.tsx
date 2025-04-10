import Link from 'next/link';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Event } from '@/lib/api/services/events';
import { CATEGORY_COLORS, CATEGORY_LABELS, STATUS_COLORS } from './event-constants';

interface EventCardProps {
  event: Event;
  index: number;
}

export function EventCard({ event, index }: EventCardProps) {
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
                    {event.registrations_count || 0} / {event.max_participants} registered
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