-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- -- Create enum for user roles
-- create type user_role as enum ('student', 'warden', 'admin');

-- Institutions table
create table public.institutions (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    code text unique not null,
    address text not null,
    city text not null,
    state text not null,
    contact_email text not null,
    contact_phone text not null,
    website text,
    logo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Hostels table
create table public.hostels (
    id uuid default uuid_generate_v4() primary key,
    institution_id uuid references public.institutions not null,
    name text not null,
    code text not null,
    address text not null,
    city text not null,
    state text not null,
    contact_email text not null,
    contact_phone text not null,
    total_blocks integer not null,
    total_rooms integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(institution_id, code)
);

-- Rooms table
create table public.rooms (
    id uuid default uuid_generate_v4() primary key,
    hostel_id uuid references public.hostels not null,
    room_number text not null,
    floor integer not null,
    capacity integer not null,
    current_occupancy integer default 0,
    room_type text not null, -- 'Single', 'Double', 'Triple'
    block text not null,
    amenities text[] default '{}',
    status text default 'available', -- 'available', 'occupied', 'maintenance'
    price integer not null,
    images text[] default '{}',
    description text default 'Spacious and well-ventilated room with modern amenities. Perfect for students looking for a comfortable living space with all essential facilities.',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint valid_status check (status in ('available', 'occupied', 'maintenance')),
    constraint valid_room_type check (room_type in ('Single', 'Double', 'Triple')),
    unique(hostel_id, room_number)
);

-- Users table (extends Supabase auth.users)
create table public.users (
    id uuid references auth.users primary key,
    full_name text not null,
    email text not null,
    phone text,
    gender text,
    role user_role not null default 'student',
    institution_id uuid references public.institutions not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Students table (extends users table for student-specific info)
create table public.students (
    user_id uuid references public.users primary key,
    student_id text not null,
    hostel_id uuid references public.hostels,
    room_number text,
    room_id uuid references public.rooms,
    department text,
    year_of_study integer,
    institution_id uuid references public.institutions not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(institution_id, student_id)
    -- Removed the invalid check constraint
);

-- Wardens table (extends users table for warden-specific info)
create table public.wardens (
    user_id uuid references public.users primary key,
    employee_id text not null,
    hostel_id uuid references public.hostels not null,
    institution_id uuid references public.institutions not null,
    assigned_blocks text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(institution_id, employee_id)
    -- Removed the invalid check constraint
);

-- Institution admins table (extends users table for admin-specific info)
create table public.institution_admins (
    user_id uuid references public.users primary key,
    employee_id text not null,
    institution_id uuid references public.institutions not null, -- Added institution_id
    department text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(institution_id, employee_id)
);



-- Room allocations table
create table public.room_allocations (
    id uuid default uuid_generate_v4() primary key,
    hostel_id uuid references public.hostels not null,
    room_id uuid references public.rooms not null,
    student_id uuid references public.students(user_id) not null,
    start_date date not null,
    end_date date,
    status text default 'active', -- 'active', 'completed', 'cancelled'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Maintenance requests table
create table public.maintenance_requests (
    id uuid default uuid_generate_v4() primary key,
    hostel_id uuid references public.hostels not null,
    student_id uuid references public.students(user_id) not null,
    room_id uuid references public.rooms not null,
    issue_type text not null, -- 'plumbing', 'electrical', 'furniture', etc.
    description text not null,
    priority text default 'medium', -- 'low', 'medium', 'high'
    status text default 'pending', -- 'pending', 'in_progress', 'completed'
    assigned_to uuid references public.users,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Complaints table
create table public.complaints (
    id uuid default uuid_generate_v4() primary key,
    hostel_id uuid references public.hostels not null,
    student_id uuid references public.students(user_id) not null,
    complaint_type text not null, -- 'ragging', 'harassment', 'facilities', 'mess', 'other'
    description text not null,
    severity text default 'medium', -- 'low', 'medium', 'high'
    status text default 'pending', -- 'pending', 'investigating', 'resolved', 'dismissed'
    is_anonymous boolean default false,
    assigned_to uuid references public.users,
    resolution_notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mess menu table
create table public.mess_menu (
    id uuid default uuid_generate_v4() primary key,
    hostel_id uuid references public.hostels not null,
    day_of_week text not null,
    meal_type text not null, -- 'breakfast', 'lunch', 'dinner'
    items jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Mess feedback table
create table public.mess_feedback (
    id uuid default uuid_generate_v4() primary key,
    hostel_id uuid references public.hostels not null,
    student_id uuid references public.students(user_id) not null,
    menu_id uuid references public.mess_menu not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    feedback text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Laundry slots table
create table public.laundry_slots (
    id uuid default uuid_generate_v4() primary key,
    hostel_id uuid references public.hostels not null,
    machine_number integer not null,
    date date not null,
    time_slot text not null,
    status text default 'available', -- 'available', 'booked', 'in_progress'
    student_id uuid references public.students(user_id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Events table
create table public.events (
    id uuid default uuid_generate_v4() primary key,
    institution_id uuid references public.institutions not null,
    title text not null,
    description text not null,
    event_date timestamp with time zone not null,
    location text not null,
    max_participants integer,
    registration_deadline timestamp with time zone,
    image_url text,
    organizer_id uuid references public.users not null,
    category text not null, -- 'cultural', 'sports', 'academic', 'social', 'other'
    status text default 'upcoming', -- 'upcoming', 'ongoing', 'completed', 'cancelled'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint valid_category check (category in ('cultural', 'sports', 'academic', 'social', 'other')),
    constraint valid_status check (status in ('upcoming', 'ongoing', 'completed', 'cancelled'))
);

-- Event registrations table
create table public.event_registrations (
    id uuid default uuid_generate_v4() primary key,
    event_id uuid references public.events not null,
    student_id uuid references public.students(user_id) not null,
    status text default 'registered', -- 'registered', 'attended', 'cancelled'
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(event_id, student_id),
    constraint valid_registration_status check (status in ('registered', 'attended', 'cancelled'))
);


-- Functions for institution-level operations
create or replace function get_user_institution_id()
returns uuid
language sql
security definer
stable
as $$
  select institution_id
  from public.users
  where id = auth.uid()
$$;

create or replace function get_user_hostel_id()
returns uuid
language sql
security definer
stable
as $$
  select 
    coalesce(
      (select hostel_id from public.students where user_id = auth.uid()),
      (select hostel_id from public.wardens where user_id = auth.uid())
    )
$$;

create or replace function user_is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1
    from public.institution_admins
    where user_id = auth.uid()
  )
$$;

-- Function to get registration counts for events
CREATE OR REPLACE FUNCTION get_event_registration_counts(institution_id uuid)
RETURNS TABLE (
  event_id uuid,
  count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    er.event_id,
    COUNT(er.id)::bigint as count
  FROM event_registrations er
  JOIN events e ON e.id = er.event_id
  WHERE e.institution_id = $1
  AND er.status = 'registered'
  GROUP BY er.event_id;
END;
$$ LANGUAGE plpgsql;
