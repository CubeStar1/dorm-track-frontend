'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { maintenanceService, MaintenanceRequest } from '@/lib/api/services/maintenance';
import { ChevronRightIcon } from 'lucide-react';

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

export default function MaintenanceRequestList() {
  const { data: requests, isLoading } = useQuery<MaintenanceRequest[]>({
    queryKey: ['maintenance-requests'],
    queryFn: () => maintenanceService.getRequests(),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-full p-4 bg-card rounded-xl border">
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!requests?.length) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border">
        <p className="text-muted-foreground">No maintenance requests found</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead className="w-8"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow 
              key={request.id}
              className="group hover:bg-muted cursor-pointer transition-colors"
            >
              <TableCell className="font-medium capitalize">
                {request.issue_type}
              </TableCell>
              <TableCell className="max-w-md truncate">
                {request.description}
              </TableCell>
              <TableCell className="font-medium">
                {request.room.room_number}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={priorityColors[request.priority]}
                >
                  {request.priority}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={statusColors[request.status]}
                >
                  {request.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {format(new Date(request.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <Link 
                  href={`/maintenance/${request.id}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRightIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 