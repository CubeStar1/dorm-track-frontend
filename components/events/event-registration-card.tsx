import { format } from 'date-fns';
import { Users, CalendarClock, Loader2Icon, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Event } from '@/lib/api/services/events';

interface EventRegistrationCardProps {
  event: Event;
  isRegistrationOpen: boolean;
  isEventFull: boolean;
  onRegister: () => void;
  onCancel: () => void;
  isRegistering: boolean;
  isCancelling: boolean;
}

export function EventRegistrationCard({
  event,
  isRegistrationOpen,
  isEventFull,
  onRegister,
  onCancel,
  isRegistering,
  isCancelling,
}: EventRegistrationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration</CardTitle>
        {event.registration_deadline && (
          <CardDescription className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4" />
            Deadline: {format(new Date(event.registration_deadline), 'PPP')}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-muted-foreground" />
          <div>
            <p className="font-medium">Participants</p>
            <p className="text-sm text-muted-foreground">
              {event.registrations_count || 0}
              {event.max_participants ? ` / ${event.max_participants}` : ''} registered
            </p>
          </div>
        </div>

        {event.is_registered === true ? (
          <Button
            variant="destructive"
            className="w-full"
            onClick={onCancel}
            disabled={isCancelling || event.status !== 'upcoming'}
          >
            {isCancelling ? (
              <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <XCircle className="w-4 h-4 mr-2" />
            )}
            Cancel Registration
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={onRegister}
            disabled={
              isRegistering ||
              !isRegistrationOpen ||
              isEventFull
            }
          >
            {isRegistering ? (
              <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <CheckCircle className="w-4 h-4 mr-2" />
            )}
            Register Now
          </Button>
        )}

        {!isRegistrationOpen && (
          <p className="text-sm text-red-600">
            {event.status !== 'upcoming'
              ? 'Registration is closed'
              : 'Registration deadline has passed'}
          </p>
        )}
        {isEventFull && !event.is_registered && (
          <p className="text-sm text-red-600">
            Event is full
          </p>
        )}
      </CardContent>
    </Card>
  );
} 