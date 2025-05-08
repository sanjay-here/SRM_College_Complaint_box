-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Update users table to include registration_number
ALTER TABLE users
  ALTER COLUMN registration_number SET NOT NULL;

-- Clear existing categories to insert new ones
DELETE FROM categories;

-- Insert updated categories
INSERT INTO categories (id, title, description, icon) VALUES
('11111111-1111-1111-1111-111111111111', 'Academic Issues', 'Issues related to courses, exams, faculty, and teaching', 'academic'),
('22222222-2222-2222-2222-222222222222', 'Campus Facilities', 'Problems with infrastructure, library, hostel, and canteen', 'facilities'),
('33333333-3333-3333-3333-333333333333', 'Transportation & Security', 'Issues with buses, bouncers, parking, and campus security', 'transportation'),
('44444444-4444-4444-4444-444444444444', 'Administrative & Services', 'Problems with fees, scholarships, transport passes, and lost items', 'building'),
('55555555-5555-5555-5555-555555555555', 'Technical & Online Services', 'Issues with Wi-Fi, internet, and student portal', 'wifi'),
('66666666-6666-6666-6666-666666666666', 'Extracurricular & General Concerns', 'Problems with clubs, sports, and event management', 'lightbulb');

-- Insert subcategories
INSERT INTO subcategories (title, description, category_id) VALUES
-- Academic Issues subcategories
('Course Scheduling Issues', 'Timetable clashes, unavailable subjects', '11111111-1111-1111-1111-111111111111'),
('Exam & Evaluation Concerns', 'Incorrect marks, re-evaluation delays', '11111111-1111-1111-1111-111111111111'),
('Faculty & Teaching Issues', 'Unfair grading, rude behavior, absenteeism', '11111111-1111-1111-1111-111111111111'),

-- Campus Facilities subcategories
('Classroom & Infrastructure Problems', 'Broken chairs, AC/fans not working', '22222222-2222-2222-2222-222222222222'),
('Library Issues', 'Book unavailability, insufficient study spaces', '22222222-2222-2222-2222-222222222222'),
('Hostel Complaints', 'Maintenance, hygiene, noise disturbances', '22222222-2222-2222-2222-222222222222'),
('Canteen & Food Services', 'Unhygienic conditions, stale food, overpricing', '22222222-2222-2222-2222-222222222222'),

-- Transportation & Security subcategories
('Bus Complaints', 'Delayed schedules, rude drivers, overcrowding', '33333333-3333-3333-3333-333333333333'),
('Bouncer Misconduct', 'Unfair treatment, aggressive behavior', '33333333-3333-3333-3333-333333333333'),
('Parking Issues', 'Lack of space, mismanagement, fines without reason', '33333333-3333-3333-3333-333333333333'),
('Security & Safety', 'Harassment, unauthorized access, theft', '33333333-3333-3333-3333-333333333333'),

-- Administrative & Services subcategories
('Fee Payment & Refund Issues', 'Delays in processing, incorrect deductions', '44444444-4444-4444-4444-444444444444'),
('Scholarship & Financial Aid', 'Issues with grants, eligibility disputes', '44444444-4444-4444-4444-444444444444'),
('Transport Pass Issues', 'Incorrect fares, pass renewal delays', '44444444-4444-4444-4444-444444444444'),
('Lost & Found', 'Reporting lost belongings', '44444444-4444-4444-4444-444444444444'),

-- Technical & Online Services subcategories
('Wi-Fi & Internet Issues', 'Slow connectivity in labs, hostels', '55555555-5555-5555-5555-555555555555'),
('Student Portal Issues', 'Login problems, incorrect attendance records', '55555555-5555-5555-5555-555555555555'),

-- Extracurricular & General Concerns subcategories
('Club & Sports Complaints', 'Unfair selection, lack of resources', '66666666-6666-6666-6666-666666666666'),
('Event Management Issues', 'Poor organization, last-minute cancellations', '66666666-6666-6666-6666-666666666666');

-- Add sample student user for testing
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
VALUES (
  '77777777-7777-7777-7777-777777777777',
  'sa5835@srmist.edu.in',
  -- This is a hashed version of 'Harisan@2124@'
  crypt('Harisan@2124@', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Sanjay"}'
)
ON CONFLICT (id) DO NOTHING;

-- Add the user to the public users table
INSERT INTO users (id, email, full_name, role, registration_number, department, created_at, updated_at)
VALUES (
  '77777777-7777-7777-7777-777777777777',
  'sa5835@srmist.edu.in',
  'Sanjay',
  'student',
  'RA2311008020159',
  'Computer Science',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Enable realtime for subcategories table
alter publication supabase_realtime add table subcategories;