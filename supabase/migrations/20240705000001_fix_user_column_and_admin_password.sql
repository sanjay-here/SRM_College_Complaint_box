-- Update admin password to ensure it works
UPDATE users
SET password = 'admin123'
WHERE email = 'admin@srm.edu.in' AND role = 'admin';

-- Create a student user for testing if it doesn't exist
INSERT INTO students (registration_number, full_name, email, password, role, department, created_at, updated_at)
VALUES (
  'RA2311008020159',
  'Test Student',
  'student@srm.edu.in',
  'student123',
  'student',
  'Computer Science',
  now(),
  now()
)
ON CONFLICT (registration_number) DO NOTHING;