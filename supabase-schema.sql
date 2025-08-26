-- InternHive Database Schema for Supabase
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE user_role AS ENUM ('HR', 'Supervisor', 'Mentor');
CREATE TYPE intern_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE task_status AS ENUM ('pending', 'in-progress', 'completed');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE document_type AS ENUM ('resume', 'certificate', 'assignment', 'report', 'resource');

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interns Table
CREATE TABLE IF NOT EXISTS interns (
    intern_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    university VARCHAR(100),
    program VARCHAR(100),
    skills JSONB, -- JSON array of skills
    status intern_status DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    assigned_admin_id UUID REFERENCES admins(admin_id),
    profile_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks/Projects Table
CREATE TABLE IF NOT EXISTS tasks (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intern_id UUID NOT NULL REFERENCES interns(intern_id) ON DELETE CASCADE,
    assigned_admin_id UUID NOT NULL REFERENCES admins(admin_id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    deadline DATE,
    status task_status DEFAULT 'pending',
    submission_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance/Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    feedback_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intern_id UUID NOT NULL REFERENCES interns(intern_id) ON DELETE CASCADE,
    admin_id UUID NOT NULL REFERENCES admins(admin_id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intern_id UUID NOT NULL REFERENCES interns(intern_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status attendance_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(intern_id, date)
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    intern_id UUID NOT NULL REFERENCES interns(intern_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type document_type NOT NULL,
    file_size INTEGER,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News Table (for the news section)
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admins(admin_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_interns_email ON interns(email);
CREATE INDEX IF NOT EXISTS idx_interns_status ON interns(status);
CREATE INDEX IF NOT EXISTS idx_interns_assigned_admin ON interns(assigned_admin_id);
CREATE INDEX IF NOT EXISTS idx_tasks_intern_id ON tasks(intern_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_attendance_intern_date ON attendance(intern_id, date);
CREATE INDEX IF NOT EXISTS idx_feedback_intern_id ON feedback(intern_id);
CREATE INDEX IF NOT EXISTS idx_documents_intern_id ON documents(intern_id);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON news(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interns_updated_at BEFORE UPDATE ON interns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feedback_updated_at BEFORE UPDATE ON feedback FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO admins (name, email, role, password_hash) VALUES
('Dr. Sarah Wilson', 'admin@company.com', 'HR', '$2b$10$hashedpassword123')
ON CONFLICT (email) DO NOTHING;

INSERT INTO interns (name, email, phone_number, university, program, skills, status, start_date, end_date, assigned_admin_id) VALUES
('Alice Johnson', 'alice@example.com', '(555) 123-4567', 'MIT', 'Computer Science', '["React", "JavaScript", "Python"]', 'active', '2024-01-15', '2024-06-15', (SELECT admin_id FROM admins WHERE email = 'admin@company.com')),
('Bob Smith', 'bob@example.com', '(555) 987-6543', 'Stanford', 'Data Science', '["Python", "Machine Learning", "SQL"]', 'active', '2024-02-01', '2024-07-01', (SELECT admin_id FROM admins WHERE email = 'admin@company.com'))
ON CONFLICT (email) DO NOTHING;

INSERT INTO tasks (intern_id, assigned_admin_id, title, description, deadline, status) VALUES
((SELECT intern_id FROM interns WHERE email = 'alice@example.com'), (SELECT admin_id FROM admins WHERE email = 'admin@company.com'), 'React Dashboard Development', 'Build a responsive dashboard using React and TypeScript', '2024-03-15', 'in-progress'),
((SELECT intern_id FROM interns WHERE email = 'bob@example.com'), (SELECT admin_id FROM admins WHERE email = 'admin@company.com'), 'Data Analysis Report', 'Analyze customer data and create visualization report', '2024-03-20', 'pending');

INSERT INTO news (title, description, content, image_url, created_by, published) VALUES
('New AI-Powered Task Assignment Feature', 'InternHive now uses intelligent matching to assign the best tasks to interns based on their skills and interests.', 'We are excited to announce our new AI-powered task assignment feature that revolutionizes how internship tasks are distributed. This intelligent system analyzes intern skills, interests, and performance history to match them with the most suitable assignments, ensuring optimal learning outcomes and project success.', '/public/hero-image.jpg', (SELECT admin_id FROM admins WHERE email = 'admin@company.com'), true),
('Real-Time Performance Analytics Dashboard', 'Track intern progress with comprehensive analytics, including performance trends and achievement milestones.', 'Our new performance analytics dashboard provides real-time insights into intern progress, helping both mentors and interns track development over time. The dashboard includes performance trends, skill development tracking, and achievement milestones to ensure continuous improvement.', '/public/hero-image.jpg', (SELECT admin_id FROM admins WHERE email = 'admin@company.com'), true),
('Mobile App Now Available', 'Access InternHive on the go with our new mobile application for both iOS and Android platforms.', 'InternHive is now available on mobile! Download our new mobile app for iOS and Android to access all your internship management features on the go. Check tasks, mark attendance, upload documents, and stay connected with your team from anywhere.', '/public/hero-image.jpg', (SELECT admin_id FROM admins WHERE email = 'admin@company.com'), true);

-- Enable Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - you may want to customize these)
-- Allow all operations for authenticated users (you can make these more restrictive)
CREATE POLICY "Allow all for authenticated users" ON admins FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON interns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON tasks FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON feedback FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON attendance FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON documents FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow read for all users" ON news FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Allow all for authenticated users" ON news FOR ALL TO authenticated USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
