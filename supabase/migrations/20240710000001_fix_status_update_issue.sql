-- Fix the status column to ensure it accepts all valid values
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check;

ALTER TABLE complaints ADD CONSTRAINT complaints_status_check 
CHECK (status IN ('pending', 'seen', 'in progress', 'resolved', 'rejected'));

-- Update any invalid status values
UPDATE complaints
SET status = 'pending'
WHERE status NOT IN ('pending', 'seen', 'in progress', 'resolved', 'rejected');
