-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
  registration_number TEXT,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'resolved', 'rejected')) DEFAULT 'pending',
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Insert default categories
INSERT INTO categories (title, description, icon) VALUES
('Academic', 'Issues related to classes, exams, and academic procedures', 'academic'),
('Campus Facilities', 'Problems with buildings, classrooms, or campus infrastructure', 'facilities'),
('Transportation', 'Concerns about college buses, routes, or schedules', 'transportation'),
('Cafeteria', 'Feedback about food quality, service, or hygiene', 'cafeteria'),
('Internet & Wi-Fi', 'Issues with campus internet connectivity or access', 'internet'),
('Laboratory', 'Problems with lab equipment, software, or resources', 'laboratory'),
('Hostel', 'Concerns about hostel facilities, rules, or management', 'hostel'),
('Other', 'Any other issues not covered by the categories above', 'other')
ON CONFLICT DO NOTHING;

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table complaints;
alter publication supabase_realtime add table comments;