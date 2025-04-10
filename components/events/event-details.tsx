import { format } from 'date-fns';
import { User, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Event } from '@/lib/api/services/events';

interface EventDetailsProps {
  event: Event;
}

export function EventDetails({ event }: EventDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Event Image */}
      {event.image_url && (
        <div className="w-full rounded-lg border bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full aspect-[4/3] object-contain"
          />
        </div>
      )}

      {/* About This Event */}
      <div>
        <h2 className="text-lg font-semibold mb-4">About This Event</h2>
        <div className="prose prose-sm prose-gray max-w-none">
          <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {event.description}
          </p>
        </div>
      </div>

      {/* Event Details */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Event Details</h2>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Date & Time</p>
            <p>{format(new Date(event.event_date), 'PPP')} at {format(new Date(event.event_date), 'p')}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Location</p>
            <p>{event.location}</p>
          </div>
          {event.registration_deadline && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Registration Deadline</p>
              <p>{format(new Date(event.registration_deadline), 'PPP')}</p>
            </div>
          )}
          {event.max_participants && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Maximum Participants</p>
              <p>{event.max_participants}</p>
            </div>
          )}
        </div>
      </div>

      {/* Organizer */}
      {event.organizer && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Organizer</h2>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{event.organizer.full_name}</p>
              <a 
                href={`mailto:${event.organizer.email}`}
                className="text-sm text-primary hover:underline flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                {event.organizer.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 