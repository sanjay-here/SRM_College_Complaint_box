-- Add subcategory_id to complaints table
ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS subcategory_id UUID REFERENCES subcategories(id) ON DELETE CASCADE;

-- Make subcategory_id required for new complaints
ALTER TABLE complaints
ALTER COLUMN subcategory_id SET NOT NULL;