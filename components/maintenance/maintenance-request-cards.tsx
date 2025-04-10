'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Link from 'next/link';
import { Loader2Icon } from 'lucide-react';
import { maintenanceService } from '@/lib/api/services/maintenance';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

const priorityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
};

export default function MaintenanceRequestCards() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenance-requests'],
    queryFn: () => maintenanceService.getRequests(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2Icon className="w-6 h-6 animate-spin text-gray-400 dark:text-gray-600" />
      </div>
    );
  }

  if (!requests?.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No maintenance requests found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <Link key={request.id} href={`/maintenance/${request.id}`}>
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{request.issue_type}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {request.description}
                  </CardDescription>
                </div>
                <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                  {request.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Priority</span>
                <Badge className={priorityColors[request.priority as keyof typeof priorityColors]}>
                  {request.priority}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Room</span>
                <span className="font-medium">{request.room?.room_number}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium">
                  {format(new Date(request.created_at), 'MMM d, yyyy')}
                </span>
              </div>

              {request.assigned_to && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Assigned to</span>
                  <span className="font-medium">{request.assigned_to.full_name}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 