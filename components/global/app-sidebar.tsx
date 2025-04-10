"use client"

import { 
  LayoutDashboard,
  BedDouble,
  Building2,
  Wrench,
  UtensilsCrossed,
  Calendar,
  Users,
  Settings,
  Shirt,
  ShoppingBag,
  Bell,
  User,
  AlertTriangle
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { NavSection } from "@/components/navigation/nav-section"
import Link from "next/link"
import { NavProfile } from "@/components/navigation/nav-profile";

const USER_ROLES = {
  STUDENT: 'student',
  WARDEN: 'warden'
} as const;

type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

const isWarden = (role: UserRole): role is typeof USER_ROLES.WARDEN => 
  role === USER_ROLES.WARDEN;

const studentNavigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Overview of your hostel life",
  },
  {
    title: "My Room",
    href: "/room",
    icon: BedDouble,
    description: "View and manage your room",
  },
  {
    title: "Room Booking",
    href: "/rooms",
    icon: Building2,
    description: "Browse and book rooms",
  },
  {
    title: "Maintenance",
    href: "/maintenance",
    icon: Wrench,
    description: "Submit and track maintenance requests",
  },
  {
    title: "Complaints",
    href: "/complaints",
    icon: AlertTriangle,
    description: "Submit and track complaints",
  },
  {
    title: "Mess Menu",
    href: "/mess",
    icon: UtensilsCrossed,
    description: "View menu and provide feedback",
  },
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
    description: "Hostel events and activities",
  },
  {
    title: "Laundry",
    href: "/laundry",
    icon: Shirt,
    description: "Book laundry slots",
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: ShoppingBag,
    description: "Buy and sell items",
  },
]

const wardenNavigationItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Hostel management overview",
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: Users,
    description: "Manage student records",
  },
  {
    title: "Rooms",
    href: "/admin/rooms",
    icon: Building2,
    description: "Room management",
  },
  {
    title: "Maintenance",
    href: "/admin/maintenance",
    icon: Wrench,
    description: "Maintenance request management",
  },
  {
    title: "Complaints",
    href: "/admin/complaints",
    icon: AlertTriangle,
    description: "Complaint management",
  },
  {
    title: "Mess Management",
    href: "/admin/mess",
    icon: UtensilsCrossed,
    description: "Manage mess menu and feedback",
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
    description: "Manage hostel events",
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Bell,
    description: "Post announcements",
  },
]

const settingsItems = [
  {
    title: "Profile",
    href: "/profile",
    icon: User,
    description: "Manage your profile",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    description: "Account settings",
  },
]

export function AppSidebar() {
  // TODO: Get user role from auth context
  const userRole: UserRole = USER_ROLES.STUDENT;

  return (
    <Sidebar className="">
      <SidebarHeader>
        <div className="relative border-b border-border/10 bg-gradient-to-br from-background/90 via-background/50 to-background/90 px-6 py-5 backdrop-blur-xl">
          <Link href="/" className="relative flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 shadow-lg ring-2 ring-blue-500/20 dark:from-blue-500 dark:via-indigo-500 dark:to-violet-500">
              <Building2 className="h-5 w-5 text-white shadow-sm" />
            </div>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                DormTrack
              </h1>
              <p className="text-sm text-muted-foreground">
                {isWarden(userRole) ? 'Admin Portal' : 'Student Portal'}
              </p>
            </div>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-b from-background/80 to-background/20 dark:from-background/60 dark:to-background/0">
        <div className="space-y-4 py-4">
          <NavSection 
            label="Navigation"
            items={isWarden(userRole) ? wardenNavigationItems : studentNavigationItems}
          />
          <NavSection 
            label="Account"
            items={settingsItems}
          />
        </div>
      </SidebarContent>
      <SidebarRail className="" />
      <SidebarFooter className="border-t border-border/20 bg-gradient-to-t from-background/90 to-background/40 px-6 py-3 backdrop-blur-xl dark:from-background/80 dark:to-background/20">
        <NavProfile user={{ name: 'John Doe', email: 'john@example.com' }} />
      </SidebarFooter>
    </Sidebar>
  );
} 