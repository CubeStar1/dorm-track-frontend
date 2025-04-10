"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { laundryService } from "@/lib/api/services/laundry";
import type { LaundrySlot } from "@/lib/api/services/laundry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon, WashingMachine, Clock, CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

const TIME_SLOT_LABELS: Record<string, string> = {
  'morning-1 (6:00 AM - 7:00 AM)': '6:00 AM - 7:00 AM',
  'morning-2 (7:00 AM - 8:00 AM)': '7:00 AM - 8:00 AM',
  'morning-3 (8:00 AM - 9:00 AM)': '8:00 AM - 9:00 AM',
  'afternoon-1 (2:00 PM - 3:00 PM)': '2:00 PM - 3:00 PM',
  'afternoon-2 (3:00 PM - 4:00 PM)': '3:00 PM - 4:00 PM',
  'evening-1 (6:00 PM - 7:00 PM)': '6:00 PM - 7:00 PM',
  'evening-2 (7:00 PM - 8:00 PM)': '7:00 PM - 8:00 PM',
};

interface BookSlotParams {
  machineNumber: number;
  timeSlot: string;
}

export default function LaundryPage() {
  const [date, setDate] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const router = useRouter();

  // Query for fetching slots
  const { data: allSlots = [], isLoading } = useQuery({
    queryKey: ['laundry-slots', format(date, "yyyy-MM-dd")],
    queryFn: async () => {
      const allSlots = await laundryService.getSlots();
      return allSlots.filter(
        (slot) => slot.date === format(date, "yyyy-MM-dd")
      );
    },
  });

  // Check if user has a booking for the selected date
  const hasBooking = allSlots.some(
    (slot) => slot.status === "booked" && slot.student_id
  );

  // Group slots by time slot
  const slotsByTime = allSlots.reduce((acc, slot) => {
    const timeSlot = slot.time_slot;
    if (!acc[timeSlot]) {
      acc[timeSlot] = [];
    }
    acc[timeSlot].push(slot);
    return acc;
  }, {} as Record<string, LaundrySlot[]>);

  // Sort time slots by time
  const sortedTimeSlots = Object.keys(slotsByTime).sort((a, b) => {
    const timeA = a.includes('morning') ? 0 : a.includes('afternoon') ? 1 : 2;
    const timeB = b.includes('morning') ? 0 : b.includes('afternoon') ? 1 : 2;
    return timeA - timeB;
  });

  // Mutation for booking a slot
  const bookMutation = useMutation({
    mutationFn: ({ machineNumber, timeSlot }: BookSlotParams) =>
      laundryService.bookSlot({
        machine_number: machineNumber,
        date: format(date, "yyyy-MM-dd"),
        time_slot: timeSlot,
      }),
    onSuccess: () => {
      toast.success("Slot booked successfully");
      queryClient.invalidateQueries({ queryKey: ['laundry-slots'] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to book slot");
    },
  });

  // Mutation for canceling a booking
  const cancelMutation = useMutation({
    mutationFn: (id: string) => laundryService.cancelBooking(id),
    onSuccess: () => {
      toast.success("Booking cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ['laundry-slots'] });
    },
    onError: () => {
      toast.error("Failed to cancel booking");
    },
  });

  const handleBookSlot = (machineNumber: number, timeSlot: string) => {
    if (hasBooking) {
      toast.error("You can only have one booking per day");
      return;
    }
    bookMutation.mutate({ machineNumber, timeSlot });
  };

  const handleCancelBooking = (slotId: string) => {
    cancelMutation.mutate(slotId);
  };

  const handleSlotClick = (slot: LaundrySlot) => {
    router.push(`/laundry/${slot.id}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Laundry Booking</h1>
            <p className="text-muted-foreground mt-1">Book your laundry slot for convenient washing</p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground bg-muted px-4 py-2 rounded-lg">
            <CalendarIcon className="w-5 h-5" />
            <span>{format(date, "MMMM d, yyyy")}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[350px,1fr] gap-6">
          <Card className="h-fit md:sticky md:top-6">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="rounded-md border w-full"
                classNames={{
                  months: "w-full",
                  month: "w-full",
                  table: "w-full",
                  head_cell: "w-10 h-10",
                  cell: "w-10 h-10 text-center p-0",
                  day: "w-10 h-10 p-0 font-normal aria-selected:opacity-100",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Slots</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : Object.keys(slotsByTime).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <WashingMachine className="w-16 h-16 mb-4" />
                  <p className="text-lg font-medium">No slots available</p>
                  <p className="text-sm">Try selecting a different date</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {sortedTimeSlots.map((timeSlot, index) => (
                    <motion.div
                      key={timeSlot}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4 text-primary" />
                        {TIME_SLOT_LABELS[timeSlot]}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {slotsByTime[timeSlot].map((slot) => (
                          <motion.div
                            key={slot.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex flex-col gap-2 p-4 border rounded-lg bg-card transition-colors cursor-pointer ${
                              slot.status === "booked" && slot.student_id
                                ? "border-primary/50 bg-primary/5"
                                : ""
                            }`}
                            onClick={() => handleSlotClick(slot)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  Machine {slot.machine_number}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {slot.status === "booked" ? "Booked" : "Available"}
                                </p>
                              </div>
                              <WashingMachine className={`w-5 h-5 ${
                                slot.status === "available" 
                                  ? "text-green-500" 
                                  : slot.status === "in_progress"
                                  ? "text-blue-500"
                                  : "text-primary"
                              }`} />
                            </div>
                            <Button
                              variant={slot.status === "booked" ? "outline" : "default"}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                slot.status === "booked"
                                  ? handleCancelBooking(slot.id)
                                  : handleBookSlot(slot.machine_number, slot.time_slot);
                              }}
                              disabled={
                                bookMutation.isPending ||
                                cancelMutation.isPending ||
                                slot.status === "in_progress" ||
                                (hasBooking && slot.status === "available")
                              }
                              className="w-full"
                            >
                              {bookMutation.isPending || cancelMutation.isPending ? (
                                <Loader2Icon className="w-4 h-4 animate-spin" />
                              ) : slot.status === "booked" ? (
                                "Cancel"
                              ) : slot.status === "in_progress" ? (
                                "In Progress"
                              ) : hasBooking ? (
                                "Already Booked"
                              ) : (
                                "Book"
                              )}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 