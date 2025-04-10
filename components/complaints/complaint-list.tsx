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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { complaintsService, Complaint } from '@/lib/api/services/complaints';
import { ChevronRightIcon } from 'lucide-react';

const severityColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  investigating: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  resolved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  dismissed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
};

interface ComplaintListProps {
  view: 'table' | 'card';
}

export default function ComplaintList({ view }: ComplaintListProps) {
  const { data: complaints, isLoading } = useQuery<Complaint[]>({
    queryKey: ['complaints'],
    queryFn: () => complaintsService.getComplaints(),
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

  if (!complaints?.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No complaints found</p>
        </CardContent>
      </Card>
    );
  }

  if (view === 'table') {
    return (
      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="w-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow 
                key={complaint.id}
                className="group hover:bg-muted cursor-pointer transition-colors"
              >
                <TableCell className="font-medium capitalize">
                  {complaint.complaint_type}
                </TableCell>
                <TableCell className="max-w-md truncate">
                  {complaint.description}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={severityColors[complaint.severity]}
                  >
                    {complaint.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={statusColors[complaint.status as keyof typeof statusColors]}
                  >
                    {complaint.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Link 
                    href={`/complaints/${complaint.id}`}
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {complaints.map((complaint) => (
        <Link key={complaint.id} href={`/complaints/${complaint.id}`}>
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base capitalize">
                    {complaint.complaint_type}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">
                    {complaint.description}
                  </CardDescription>
                </div>
                <Badge className={statusColors[complaint.status as keyof typeof statusColors]}>
                  {complaint.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Severity</span>
                <Badge className={severityColors[complaint.severity]}>
                  {complaint.severity}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Submitted</span>
                <span className="font-medium">
                  {format(new Date(complaint.created_at), 'MMM d, yyyy')}
                </span>
              </div>

              {complaint.assigned_staff && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Assigned to</span>
                  <span className="font-medium">
                    {complaint.assigned_staff.full_name}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
} 