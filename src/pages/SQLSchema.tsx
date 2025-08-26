import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const SQLSchema = () => {
  const sqlSchema = `-- Intern Management System Database Schema
-- Created for InternHive Application

-- Admins Table
CREATE TABLE admins (
    admin_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('HR', 'Supervisor', 'Mentor') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Interns Table  
CREATE TABLE interns (
    intern_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_number VARCHAR(20),
    university VARCHAR(100),
    program VARCHAR(100),
    skills TEXT, -- JSON array of skills
    status ENUM('active', 'completed', 'dropped') DEFAULT 'active',
    start_date DATE,
    end_date DATE,
    assigned_admin_id VARCHAR(50),
    profile_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_admin_id) REFERENCES admins(admin_id)
);

-- Tasks/Projects Table
CREATE TABLE tasks (
    task_id VARCHAR(50) PRIMARY KEY,
    intern_id VARCHAR(50) NOT NULL,
    assigned_admin_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    deadline DATE,
    status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
    submission_url VARCHAR(500),
    submitted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intern_id) REFERENCES interns(intern_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_admin_id) REFERENCES admins(admin_id)
);

-- Performance/Feedback Table
CREATE TABLE feedback (
    feedback_id VARCHAR(50) PRIMARY KEY,
    intern_id VARCHAR(50) NOT NULL,
    admin_id VARCHAR(50) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intern_id) REFERENCES interns(intern_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);

-- Attendance Table
CREATE TABLE attendance (
    attendance_id VARCHAR(50) PRIMARY KEY,
    intern_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    check_in_time TIME,
    check_out_time TIME,
    status ENUM('present', 'absent', 'late') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intern_id) REFERENCES interns(intern_id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance (intern_id, date)
);

-- Documents Table
CREATE TABLE documents (
    document_id VARCHAR(50) PRIMARY KEY,
    intern_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type ENUM('resume', 'certificate', 'assignment', 'report', 'resource') NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intern_id) REFERENCES interns(intern_id) ON DELETE CASCADE
);

-- Notifications/Messages Table
CREATE TABLE messages (
    message_id VARCHAR(50) PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    sender_type ENUM('admin', 'intern') NOT NULL,
    receiver_type ENUM('admin', 'intern') NOT NULL,
    content TEXT NOT NULL,
    status ENUM('read', 'unread') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Certificates Table
CREATE TABLE certificates (
    certificate_id VARCHAR(50) PRIMARY KEY,
    intern_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    issued_by VARCHAR(100),
    issued_date DATE,
    certificate_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (intern_id) REFERENCES interns(intern_id) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX idx_interns_assigned_admin ON interns(assigned_admin_id);
CREATE INDEX idx_tasks_intern ON tasks(intern_id);
CREATE INDEX idx_tasks_admin ON tasks(assigned_admin_id);
CREATE INDEX idx_feedback_intern ON feedback(intern_id);
CREATE INDEX idx_attendance_intern_date ON attendance(intern_id, date);
CREATE INDEX idx_documents_intern ON documents(intern_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, receiver_type);

-- Sample Data Inserts
INSERT INTO admins (admin_id, name, email, role, password_hash, created_at) VALUES
('1', 'Dr. Sarah Wilson', 'admin@company.com', 'HR', '$2b$10$hashedpassword123', NOW());

INSERT INTO interns (intern_id, name, email, phone_number, university, program, skills, status, start_date, end_date, assigned_admin_id) VALUES
('1', 'Alice Johnson', 'alice@example.com', '(555) 123-4567', 'MIT', 'Computer Science', '["React", "JavaScript", "Python"]', 'active', '2024-01-15', '2024-06-15', '1'),
('2', 'Bob Smith', 'bob@example.com', '(555) 987-6543', 'Stanford', 'Data Science', '["Python", "Machine Learning", "SQL"]', 'active', '2024-02-01', '2024-07-01', '1');

INSERT INTO tasks (task_id, intern_id, assigned_admin_id, title, description, deadline, status) VALUES
('1', '1', '1', 'React Dashboard Development', 'Build a responsive dashboard using React and TypeScript', '2024-03-15', 'in-progress'),
('2', '2', '1', 'Data Analysis Report', 'Analyze customer data and create visualization report', '2024-03-20', 'pending');`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    toast.success('SQL schema copied to clipboard!');
  };

  const downloadSQL = () => {
    const blob = new Blob([sqlSchema], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'internhive_schema.sql';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('SQL schema downloaded!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <Link to="/" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-4">InternHive Database Schema</h1>
          <p className="text-muted-foreground">
            Complete SQL database schema for the Intern Management System with tables, relationships, and sample data.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Database Architecture Overview
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy SQL
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadSQL}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Relational database structure supporting all InternHive features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Core Tables</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>admins</strong> - Administrator profiles and roles</li>
                    <li>• <strong>interns</strong> - Intern profiles and program details</li>
                    <li>• <strong>tasks</strong> - Task assignments and submissions</li>
                    <li>• <strong>feedback</strong> - Performance evaluations</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Supporting Tables</h3>
                  <ul className="space-y-2 text-sm">
                    <li>• <strong>attendance</strong> - Daily attendance records</li>
                    <li>• <strong>documents</strong> - File uploads and resources</li>
                    <li>• <strong>messages</strong> - Internal communication</li>
                    <li>• <strong>certificates</strong> - Achievement certificates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Complete SQL Schema</CardTitle>
              <CardDescription>
                Production-ready database schema with proper indexes and constraints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap font-mono">
                {sqlSchema}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Data Integrity</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Foreign key constraints</li>
                    <li>• Cascading deletes</li>
                    <li>• Enum validations</li>
                    <li>• Unique constraints</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Performance</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Optimized indexes</li>
                    <li>• Efficient queries</li>
                    <li>• Proper data types</li>
                    <li>• Relationship indexes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Scalability</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Normalized structure</li>
                    <li>• Flexible JSON fields</li>
                    <li>• Extensible design</li>
                    <li>• Standard SQL syntax</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SQLSchema;