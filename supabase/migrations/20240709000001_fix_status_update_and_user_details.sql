-- Update the default user with student details
UPDATE users
SET 
  full_name = 'Sanjay A',
  registration_number = 'RA2311008020159',
  department = 'Information Technology'
WHERE id = '00000000-0000-0000-0000-000000000000';

-- Ensure all status values are valid and can be updated
UPDATE complaints
SET status = 'pending'
WHERE status NOT IN ('pending', 'seen', 'in progress', 'resolved', 'rejected');

-- Fix the status column to ensure it accepts all valid values
COMMENT ON COLUMN complaints.status IS 'Status of the complaint: pending, seen, in progress, resolved, rejected';
