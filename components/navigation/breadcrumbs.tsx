"use client"

import { ModeToggle } from "@/components/global/theme-switcher"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"

const routes = {
  "/": {
    name: "Home",
    path: "/",
  },
  "/dashboard": {
    name: "Dashboard",
    path: "/dashboard",
    description: "Overview of your hostel life",
  },
  "/my-room": {
    name: "My Room",
    path: "/my-room",
    description: "View your room details",
  },
  "/rooms": {
    name: "Room Booking",
    path: "/rooms",
    description: "Browse and manage rooms",
  },
  "/maintenance": {
    name: "Maintenance",
    path: "/maintenance",
    description: "Maintenance requests",
  },
  "/complaints": {
    name: "Complaints",
    path: "/complaints",
    description: "View and manage complaints",
  },
  "/mess": {
    name: "Mess Menu",
    path: "/mess",
    description: "Mess menu and feedback",
  },
  "/events": {
    name: "Events",
    path: "/events",
    description: "Hostel events and activities",
  },
  "/laundry": {
    name: "Laundry",
    path: "/laundry",
    description: "Laundry services",
  },
  "/marketplace": {
    name: "Marketplace",
    path: "/marketplace",
    description: "Buy and sell items",
  },
  "/profile": {
    name: "Profile",
    path: "/profile",
    description: "Manage your profile",
  },
  "/settings": {
    name: "Settings",
    path: "/settings",
    description: "Account settings"
  }
}

export function Breadcrumbs({ 
  action 
}: { 
  action?: React.ReactNode 
}) {
  const pathname = usePathname()
  
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const items = []
    let currentPath = ""
    
    // Always add home
    items.push(
      <BreadcrumbItem key="home">
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
    )

    // Add intermediate segments
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const route = routes[currentPath as keyof typeof routes]
      
      if (route) {
        items.push(<BreadcrumbSeparator key={`separator-${index}`} />)
        
        if (index === segments.length - 1) {
          // Last segment - show as current page
          items.push(
            <BreadcrumbItem key={currentPath}>
              <BreadcrumbPage>{route.name}</BreadcrumbPage>
            </BreadcrumbItem>
          )
        } else {
          // Intermediate segment - show as link
          items.push(
            <BreadcrumbItem key={currentPath}>
              <BreadcrumbLink href={route.path}>{route.name}</BreadcrumbLink>
            </BreadcrumbItem>
          )
        }
      }
    })

    return items
  }

  return (
    <header className="flex h-20 z-50 shrink-0 sticky top-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {getBreadcrumbs()}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-4">
          {action}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
} 