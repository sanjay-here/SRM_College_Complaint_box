-- Set replica identity for users table to enable updates
ALTER TABLE users REPLICA IDENTITY FULL;

-- Create a new table for students with registration_number as primary key
CREATE TABLE IF NOT EXISTS students (
  registration_number TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  department TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Insert sample student
INSERT INTO students (registration_number, email, full_name, password, department, role)
VALUES (
  'RA2311008020159',
  'sa5835@srmist.edu.in',
  'Sanjay',
  'Harisan@2124@',
  'Computer Science',
  'student'
)
ON CONFLICT (registration_number) DO UPDATE SET
  password = 'Harisan@2124@',
  email = 'sa5835@srmist.edu.in',
  full_name = 'Sanjay',
  department = 'Computer Science';