-- Create a default user ID for student complaints if it doesn't exist
INSERT INTO users (id, email, full_name, role, registration_number, department, password, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'default@srm.edu.in',
  'Default User',
  'student',
  'DEFAULT001',
  'Default Department',
  'default123',
  now(),
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Update admin email to match the one being used
UPDATE users
SET email = 'admin@srmist.edu.in', password = 'admin123'
WHERE role = 'admin';

-- Insert admin user if it doesn't exist
INSERT INTO users (id, email, full_name, role, registration_number, department, password, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  'admin@srmist.edu.in',
  'SRM Admin',
  'admin',
  'ADMIN001',
  'Administration',
  'admin123',
  now(),
  now()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@srmist.edu.in');