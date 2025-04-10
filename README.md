 Idea
DormTrack is a comprehensive hostel management platform that 
offers automation for room allocation, complaint redressal, mess 
feedback, event management, and more. It is designed to improve the 
experience for both students and administrators through an automotive 
and community focused design
 “DormTrack brings a 360° digital solution to hostel life”
 What it does and Key Features
 •Room Management: Auto-room allocation, roommate matching, room swapping requests
 •Maintenance & Cleaning: Complaint submission and status tracking, scheduled cleaning
 •Laundry & Utility: Machine booking, laundry vendor integration
 •Mess Feedback: Daily food ratings, hygiene feedback, weekly menu view
 •Event & Community Management: Hostel events, announcements, and RSVP system
 •Billing & Fee Reminders: Monthly invoices, payment gateway integration


 Student Frontend Routes (Next.js App Router)
/                              # Landing/Login page
/auth/register                 # Registration page
/dashboard                     # Student dashboard home
/profile                       # User profile management
/rooms                         # Room availability and map view
/rooms/book                    # Room booking interface
/rooms/[id]                    # Individual room details
/maintenance/new               # Submit maintenance requests
/maintenance                   # View my maintenance requests
/maintenance/[id]              # Track specific request details
/mess                          # Mess menu and feedback form
/mess/history                  # Past feedback history
/laundry                       # Laundry booking system
/laundry/history               # Past laundry bookings
/events                        # Event listing
/events/[id]                   # Event details and RSVP
/marketplace                   # Buy/sell marketplace
/marketplace/my-listings       # Manage my listings
/marketplace/create            # Create new listing
/marketplace/[id]              # Individual listing details