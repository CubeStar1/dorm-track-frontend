'use client';

import { useQuery } from '@tanstack/react-query';
import { WelcomeCard } from '@/components/dashboard/welcome-card';
import { RoomCard } from '@/components/dashboard/room-card';
import { dashboardService } from '@/lib/api/services/dashboard';
import { 
  Loader2Icon, 
  LayoutDashboard, 
  WrenchIcon, 
  AlertCircleIcon,
  ChevronRightIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaintenanceRequestCards from '@/components/maintenance/maintenance-request-cards';
import ComplaintList from '@/components/complaints/complaint-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getDashboardData,
  });

  if (isLoading || !dashboardData) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2Icon className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 px-4">
      <div className="bg-white border-b">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-primary/10">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your hostel information and recent activities.
          </p>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <WelcomeCard className="md:col-span-1" user={dashboardData.user} />
          <RoomCard className="md:col-span-1" room={dashboardData.room} />
        </div>

        <div className="bg-white rounded-2xl border p-6 shadow-sm">
          <Tabs defaultValue="maintenance" className="w-full">
            <TabsList className="w-full max-w-[400px] grid grid-cols-2 mb-6">
              <TabsTrigger value="maintenance" className="flex items-center gap-2">
                <WrenchIcon className="w-4 h-4" />
                Maintenance
              </TabsTrigger>
              <TabsTrigger value="complaints" className="flex items-center gap-2">
                <AlertCircleIcon className="w-4 h-4" />
                Complaints
              </TabsTrigger>
            </TabsList>

            <TabsContent value="maintenance" className="mt-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Recent Maintenance Requests
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Track the status of your maintenance requests
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/maintenance" className="flex items-center gap-2">
                      View All
                      <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
                <MaintenanceRequestCards />
              </div>
            </TabsContent>

            <TabsContent value="complaints" className="mt-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Recent Complaints
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      Monitor your submitted complaints and their status
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/complaints" className="flex items-center gap-2">
                      View All
                      <ChevronRightIcon className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
                <ComplaintList view="card" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
