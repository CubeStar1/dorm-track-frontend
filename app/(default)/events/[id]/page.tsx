'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Loader2Icon, AlertTriangle, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EventDetails } from '@/components/events/event-details';
import { EventRegistrationCard } from '@/components/events/event-registration-card';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '@/components/events/event-constants';
import { eventsService } from '@/lib/api/services/events';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function EventPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsService.getEvent(id as string),
  });

  const registerMutation = useMutation({
    mutationFn: () => eventsService.registerForEvent(id as string),
    onSuccess: () => {
      toast.success('Successfully registered for event');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to register for event');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => eventsService.cancelRegistration(id as string),
    onSuccess: () => {
      toast.success('Successfully cancelled registration');
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: () => {
      toast.error('Failed to cancel registration');
    },
  });

  const handleRegister = () => {
    if (confirm('Are you sure you want to register for this event?')) {
      registerMutation.mutate();
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel your registration?')) {
      cancelMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2Icon className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Event not found</h1>
        <p className="text-muted-foreground mb-4">This event doesn't exist or you don't have access to view it.</p>
        <Link href="/events">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  const isRegistrationOpen = event.status === 'upcoming' && (!event.registration_deadline || new Date(event.registration_deadline) > new Date());
  const isEventFull = event.max_participants ? (event.registrations_count || 0) >= event.max_participants : false;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Link href="/events">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
          </Link>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            CATEGORY_COLORS[event.category].bg
          } ${CATEGORY_COLORS[event.category].text}`}>
            {CATEGORY_LABELS[event.category]}
          </div>
        </div>

        {/* Title and Date */}
        <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
        <div className="flex flex-col gap-1 mb-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{format(new Date(event.event_date), 'PPP')}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{format(new Date(event.event_date), 'p')}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Navigation */}
          <div className="col-span-3">
            <nav className="flex flex-col gap-1">
              <Button
                variant="ghost"
                className="justify-start font-medium"
              >
                About This Event
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-muted-foreground"
              >
                Venue
              </Button>
              <Button
                variant="ghost"
                className="justify-start text-muted-foreground"
              >
                Downloads
              </Button>
            </nav>

            {/* Registration Card */}
            <div className="mt-8">
              <EventRegistrationCard
                event={event}
                isRegistrationOpen={isRegistrationOpen}
                isEventFull={isEventFull}
                onRegister={handleRegister}
                onCancel={handleCancel}
                isRegistering={registerMutation.isPending}
                isCancelling={cancelMutation.isPending}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-6">
            <EventDetails event={event} />
          </div>

          {/* Right Sidebar - Venue */}
          <div className="col-span-3">
            <div className="bg-card rounded-lg border p-4">
              <h2 className="text-lg font-semibold mb-4">Venue</h2>
              <p className="text-sm text-muted-foreground mb-4">{event.location}</p>
              <div className="aspect-square w-full rounded-lg overflow-hidden border">
                <iframe
                  title="Event Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&q=${encodeURIComponent(event.location)}`}
                  allowFullScreen
                />
              </div>
            </div>

            {/* Downloads Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Downloads</h2>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => window.open('#', '_blank')}
              >
                <span>Brochure</span>
                <span className="ml-auto">↓</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 