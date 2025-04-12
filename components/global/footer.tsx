import { Building2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from "@/lib/utils"

interface FooterProps {
    className?: string;
}

const Footer = ({ className }: FooterProps) => {
    return (
        <footer className={cn("w-full border-t border-border", className)}>
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid gap-8 lg:grid-cols-4">
                    {/* Brand section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-2">
                            <img 
                                src="/dorm-track-logo.png"
                                alt="DormTrack Logo"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <span className="text-lg font-semibold">DormTrack</span>
                        </div>
                        <p className="mt-4 text-sm text-muted-foreground">
                            A comprehensive hostel management platform that offers automation for room allocation, complaint redressal, mess feedback, and more.
                        </p>
                    </div>

                    {/* Links sections */}
                    <div className="col-span-3 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {/* Hostel Activities */}
                        <div>
                            <h3 className="text-sm font-semibold">Hostel Activities</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <Link href="/my-room" className="text-muted-foreground hover:text-foreground transition-colors">
                                        My Room
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/rooms" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Room Booking
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/maintenance" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Maintenance
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/complaints" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Complaints
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-sm font-semibold">Services</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <Link href="/mess" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Mess Menu
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/events" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Events
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/laundry" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Laundry
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Marketplace
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Account */}
                        <div>
                            <h3 className="text-sm font-semibold">Account</h3>
                            <ul className="mt-4 space-y-3 text-sm">
                                <li>
                                    <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/settings" className="text-muted-foreground hover:text-foreground transition-colors">
                                        Settings
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 border-t border-border/40 pt-8">
                    <p className="text-sm text-muted-foreground">
                        &copy; {new Date().getFullYear()} DormTrack. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
