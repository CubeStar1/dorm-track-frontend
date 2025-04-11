'use client';

import { DashboardUser } from '@/lib/api/services/dashboard';
import { cn } from '@/lib/utils';
import { 
  GraduationCapIcon, 
  MailIcon, 
  IdCardIcon,
  UserIcon,
  CalendarIcon,
  WrenchIcon,
  AlertTriangleIcon,
  UtensilsCrossedIcon,
  ShirtIcon,
  ChevronRightIcon
} from 'lucide-react';
import Link from 'next/link';

interface QuickLink {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

const quickLinks: QuickLink[] = [
  {
    title: 'Maintenance',
    href: '/maintenance',
    icon: WrenchIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Complaints',
    href: '/complaints',
    icon: AlertTriangleIcon,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  {
    title: 'Mess Menu',
    href: '/mess',
    icon: UtensilsCrossedIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    title: 'Laundry',
    href: '/laundry',
    icon: ShirtIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
];

interface WelcomeCardProps {
  user: DashboardUser;
  className?: string;
}

export function WelcomeCard({ user, className }: WelcomeCardProps) {
  const timeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow",
      className
    )}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">
            Good {timeOfDay()}, {user.full_name}!
          </h2>
          <p className="text-muted-foreground mt-1">Welcome to your hostel dashboard</p>
        </div>
        <div className="p-3 rounded-full bg-primary/10">
          <UserIcon className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="grid gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <IdCardIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Student ID</p>
            <p className="font-medium">{user.student_id}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-50">
            <GraduationCapIcon className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Department</p>
            <p className="font-medium">{user.department || 'Not specified'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-green-50">
            <CalendarIcon className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Year of Study</p>
            <p className="font-medium">Year {user.year_of_study || 'Not specified'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-amber-50">
            <MailIcon className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 p-3 rounded-xl border bg-card hover:bg-accent transition-colors"
            >
              <div className={cn("p-2 rounded-full", link.bgColor)}>
                <link.icon className={cn("w-4 h-4", link.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{link.title}</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 