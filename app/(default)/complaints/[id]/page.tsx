'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CustomButton from '@/components/ui/custom-button';
import {
  AlertTriangleIcon,
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  SearchIcon,
  Loader2Icon,
  UserIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { complaintsService } from '@/lib/api/services/complaints';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <ClockIcon className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />;
    case 'investigating':
      return <SearchIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
    case 'resolved':
      return <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400" />;
    case 'dismissed':
      return <XCircleIcon className="w-5 h-5 text-red-500 dark:text-red-400" />;
    default:
      return null;
  }
};

const getSeverityBadgeColor = (severity: string) => {
  switch (severity) {
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

export default function ComplaintDetailsPage() {
  const { id } = useParams();

  const { data: complaint, isLoading } = useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintsService.getComplaint(id as string),
  });

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2Icon className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <AlertTriangleIcon className="w-12 h-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Complaint not found</h1>
        <p className="text-muted-foreground mb-4">This complaint doesn't exist or you don't have access to view it.</p>
        <Link href="/complaints">
          <CustomButton variant="outline">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Complaints
          </CustomButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Link href="/complaints">
          <CustomButton variant="outline" size="sm">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Complaints
          </CustomButton>
        </Link>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityBadgeColor(complaint.severity)}`}>
          {complaint.severity.charAt(0).toUpperCase() + complaint.severity.slice(1)} Severity
        </span>
      </div>

      {/* Main content */}
      <Card>
        <CardContent className="p-6 space-y-6 divide-y divide-border">
          {/* Complaint Details */}
          <div className="pb-6">
            <h1 className="text-2xl font-semibold mb-4">
              {complaint.complaint_type.charAt(0).toUpperCase() + complaint.complaint_type.slice(1)} Complaint
            </h1>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              {getStatusIcon(complaint.status)}
              <span className="capitalize">{complaint.status.replace('_', ' ')}</span>
              <span className="text-border mx-2">•</span>
              <CalendarIcon className="w-4 h-4" />
              <span>Submitted {format(new Date(complaint.created_at), 'MMM d, yyyy')}</span>
              {complaint.is_anonymous && (
                <>
                  <span className="text-border mx-2">•</span>
                  <Badge variant="outline">Anonymous</Badge>
                </>
              )}
            </div>

            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-muted-foreground">
              {complaint.description}
            </p>
          </div>

          {/* Resolution Notes */}
          {complaint.resolution_notes && (
            <div className="pt-6">
              <h2 className="font-medium mb-3">Resolution Notes</h2>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  {complaint.resolution_notes}
                </p>
              </div>
            </div>
          )}

          {/* Assigned Staff */}
          {complaint.assigned_to && (
            <div className="pt-6">
              <h2 className="font-medium mb-3">Assigned Staff</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{complaint.assigned_to}</p>
                  <p className="text-sm text-muted-foreground">Staff Member</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 