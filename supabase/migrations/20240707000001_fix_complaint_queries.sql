-- Update all existing complaints to use the default user ID
UPDATE complaints
SET user_id = '00000000-0000-0000-0000-000000000000'
WHERE user_id IS NULL OR user_id::text = '';

-- Add a default user if it doesn't exist yet
INSERT INTO auth.users (id, email, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'default@srm.edu.in',
  now()
)
ON CONFLICT (id) DO NOTHING;

-- Create the corresponding public user
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