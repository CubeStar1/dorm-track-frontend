'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  ArrowLeftIcon,
  Loader2Icon,
  WrenchIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  BuildingIcon,
  DoorClosedIcon,
  CalendarIcon
} from 'lucide-react';
import CustomButton from '@/components/ui/custom-button';
import { format } from 'date-fns';
import { maintenanceService } from '@/lib/api/services/maintenance';
import { Card, CardContent } from '@/components/ui/card';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <ClockIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
    case 'in_progress':
      return <WrenchIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    case 'completed':
      return <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />;
    default:
      return null;
  }
};

const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

export default function MaintenanceRequestPage() {
  const { id } = useParams();

  const { data: request, isLoading } = useQuery({
    queryKey: ['maintenance-request', id],
    queryFn: () => maintenanceService.getRequest(id as string),
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <AlertTriangleIcon className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Request not found</h1>
        <p className="text-muted-foreground mb-4">This maintenance request doesn't exist or you don't have access to view it.</p>
        <Link href="/maintenance">
          <CustomButton variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Maintenance
          </CustomButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/maintenance">
          <CustomButton variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Maintenance
          </CustomButton>
        </Link>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeColor(request.priority)}`}>
          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)} Priority
        </span>
      </div>

      {/* Main content */}
      <Card>
        {/* Issue Details */}
        <CardContent className="p-6 divide-y divide-border">
          <div className="pb-6">
            <h1 className="text-2xl font-semibold mb-4">
              {request.issue_type.charAt(0).toUpperCase() + request.issue_type.slice(1)} Issue
            </h1>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              {getStatusIcon(request.status)}
              <span className="capitalize">{request.status.replace('_', ' ')}</span>
              <span className="text-border mx-2">•</span>
              <CalendarIcon className="w-4 h-4" />
              <span>Submitted {format(new Date(request.created_at), 'MMM d, yyyy')}</span>
            </div>

            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-muted-foreground">
              {request.description}
            </p>
          </div>

          {/* Location Details */}
          <div className="py-6">
            <h2 className="font-medium mb-3">Location Details</h2>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <BuildingIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Hostel</p>
                  <p className="text-sm text-muted-foreground">{request.hostel.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DoorClosedIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Room</p>
                  <p className="text-sm text-muted-foreground">{request.room.room_number}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Staff */}
          {request.assigned_to && (
            <div className="py-6">
              <h2 className="font-medium mb-3">Assigned Staff</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {request.assigned_to.full_name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{request.assigned_to.full_name}</p>
                  <p className="text-sm text-muted-foreground">{request.assigned_to.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6">
            <CustomButton 
              variant={request.status === 'completed' ? 'outline' : 'primary'}
              disabled={request.status === 'completed'}
              fullWidth
            >
              {request.status === 'completed' ? 'Request Resolved' : 'Mark as Resolved'}
            </CustomButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 