'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  ArrowLeftIcon, 
  Loader2Icon, 
  WashingMachine, 
  CalendarIcon,
  ClockIcon,
  BuildingIcon,
  UserIcon,
  AlertTriangleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { laundryService } from '@/lib/api/services/laundry';
import { toast } from 'sonner';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'booked':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'in_progress':
      return <Loader2Icon className="w-5 h-5 text-blue-500" />;
    case 'available':
      return <WashingMachine className="w-5 h-5 text-muted-foreground" />;
    default:
      return null;
  }
};

export default function LaundrySlotPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: slot, isLoading } = useQuery({
    queryKey: ['laundry-slot', id],
    queryFn: () => laundryService.getSlot(id as string),
  });

  const cancelMutation = useMutation({
    mutationFn: (slotId: string) => laundryService.cancelBooking(slotId),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ['laundry-slot'] });
      router.push('/laundry');
    },
    onError: () => {
      toast.error("Failed to cancel booking");
    },
  });

  const handleCancelBooking = () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      cancelMutation.mutate(id as string);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!slot) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <AlertTriangleIcon className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Slot not found</h1>
        <p className="text-muted-foreground mb-4">This laundry slot doesn't exist or you don't have access to view it.</p>
        <Link href="/laundry">
          <Button variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Laundry
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link href="/laundry">
            <Button variant="outline" size="sm">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Laundry
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-muted-foreground">
            {getStatusIcon(slot.status)}
            <span className="capitalize">{slot.status}</span>
          </div>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WashingMachine className="w-6 h-6" />
              Machine {slot.machine_number}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Time and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(slot.date), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                <ClockIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Time Slot</p>
                  <p className="text-sm text-muted-foreground">
                    {slot.time_slot}
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
              <BuildingIcon className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {slot.hostel?.name} ({slot.hostel?.code})
                </p>
              </div>
            </div>

            {/* Booked By (if booked) */}
            {slot.status === 'booked' && slot.student && (
              <div className="flex items-center gap-3 bg-muted p-4 rounded-lg">
                <UserIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Booked By</p>
                  <p className="text-sm text-muted-foreground">
                    {slot.student.user.full_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {slot.student.user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Action Button */}
            {slot.status === 'booked' && slot.student_id && (
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleCancelBooking}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <Loader2Icon className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Cancel Booking
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 