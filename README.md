# DormTrack
- DormTrack is a comprehensive hostel management platform that 
offers automation for room allocation, complaint redressal, mess 
feedback, event management, and more.
- It is designed to improve the 
experience for both students and administrators through an automotive 
and community focused design
 - “DormTrack brings a 360° digital solution to hostel life”

### What it does and Key Features
- Room Management: Auto-room allocation, roommate matching, room swapping requests
- Maintenance & Cleaning: Complaint submission and status tracking, scheduled cleaning
- Laundry & Utility: Machine booking, laundry vendor integration
- Mess Feedback: Daily food ratings, hygiene feedback, weekly menu view
- Event & Community Management: Hostel events, announcements, and RSVP system
- Billing & Fee Reminders: Monthly invoices, payment gateway integration

### Student Frontend Routes (Next.js App Router)
 app/ \
├── page.tsx              ||    Landing/Login page \
├── auth/ \
│   └── register/             ||    Registration page \
├── dashboard/ \
│   └── page.tsx              ||    Student dashboard home \
├── profile/ \
│   └── page.tsx              ||    User profile management \
├── rooms/ \
│   ├── page.tsx              ||    Room availability and map view \
│   ├── book/                 ||    Room booking interface \
│   └── [id]/                 ||    Individual room details \
├── maintenance/ \
│   ├── page.tsx              ||    View my maintenance requests \
│   ├── new/                  ||    Submit maintenance requests \
│   └── [id]/                 ||    Track specific request details \
├── mess/ \
│   ├── page.tsx              ||    Mess menu and feedback form \
│   └── history/              ||    Past feedback history \
├── laundry/ \
│   ├── page.tsx              ||    Laundry booking system \
│   └── history/              ||    Past laundry bookings \
├── events/ \
│   ├── page.tsx              ||    Event listing \
│   └── [id]/                 Event details and RSVP \
└── marketplace/ \
    ├── page.tsx              Buy/sell marketplace \
    ├── my-listings/          ||    Manage my listings \
    ├── create/               ||    Create new listing \
    └── [id]/                 ||    Individual listing details \

## Getting Started
1. Clone the repository

```
git clone https://github.com/CubeStar1/dormt-track-frontend.git
```

2. Install dependencies

```
npm install
```

3. Run the development server

```
npm run dev
```

4. Open the browser and navigate to `http://localhost:3000`


