-- Add new ragging category if it doesn't exist already
INSERT INTO categories (id, title, description, icon)
SELECT 
  uuid_generate_v4(), 
  'Ragging & Student Conduct', 
  'Report ragging incidents, student misbehavior, or fights', 
  'user'
WHERE NOT EXISTS (
  SELECT 1 FROM categories WHERE title = 'Ragging & Student Conduct'
);

-- Add subcategories for the new ragging category
DO $$
DECLARE
  v_category_id uuid;
BEGIN
  -- Get the category ID
  SELECT id INTO v_category_id FROM categories WHERE title = 'Ragging & Student Conduct';
  
  -- Only proceed if we found the category
  IF v_category_id IS NOT NULL THEN
    -- Add subcategories if they don't exist
    INSERT INTO subcategories (category_id, title, description)
    SELECT 
      v_category_id,
      'Ragging Incident',
      'Report an incident of ragging or bullying by seniors or other students'
    WHERE NOT EXISTS (
      SELECT 1 FROM subcategories 
      WHERE category_id = v_category_id AND title = 'Ragging Incident'
    );
    
    INSERT INTO subcategories (category_id, title, description)
    SELECT 
      v_category_id,
      'Student Misbehavior',
      'Report inappropriate behavior, harassment, or misconduct by students'
    WHERE NOT EXISTS (
      SELECT 1 FROM subcategories 
      WHERE category_id = v_category_id AND title = 'Student Misbehavior'
    );
    
    INSERT INTO subcategories (category_id, title, description)
    SELECT 
      v_category_id,
      'Fight or Altercation',
      'Report a physical or verbal altercation between students'
    WHERE NOT EXISTS (
      SELECT 1 FROM subcategories 
      WHERE category_id = v_category_id AND title = 'Fight or Altercation'
    );
  END IF;
END
$$;