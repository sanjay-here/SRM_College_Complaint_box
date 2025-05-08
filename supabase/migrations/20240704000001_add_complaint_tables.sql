-- Add incident_date column to complaints table
ALTER TABLE complaints ADD COLUMN IF NOT EXISTS incident_date TIMESTAMP WITH TIME ZONE;

-- Create complaint_evidence table
CREATE TABLE IF NOT EXISTS complaint_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add password column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;

-- Create admin user directly in auth.users first
INSERT INTO auth.users (id, email, role, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@srm.edu.in',
  'admin',
  now(),
  now()
);

-- Then create the corresponding user in public.users
INSERT INTO users (id, email, full_name, role, registration_number, department, password, created_at, updated_at)
SELECT 
  id,
  'admin@srm.edu.in',
  'SRM Admin',
  'admin',
  'ADMIN001',
  'Administration',
  'SRMadmin123',
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@srm.edu.in';

-- Enable storage for complaint evidence
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaints', 'complaints', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy
DROP POLICY IF EXISTS "Anyone can upload evidence" ON storage.objects;
CREATE POLICY "Anyone can upload evidence"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'complaints');

DROP POLICY IF EXISTS "Anyone can view evidence" ON storage.objects;
CREATE POLICY "Anyone can view evidence"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'complaints');

-- Add realtime for complaint_evidence only
alter publication supabase_realtime add table complaint_evidence;