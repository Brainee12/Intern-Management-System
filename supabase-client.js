// Supabase Client for InternHive Vanilla JavaScript Application
// This file handles all database operations with Supabase

// Supabase configuration
const SUPABASE_URL = "https://mhlybrzieiygmmmsbjqq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1obHlicnppZWl5Z21tbXNianFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxMjg5NjUsImV4cCI6MjA3MTcwNDk2NX0.f8WJ1fsA2l3AdA75MJ5no1IaOqHssVJcJYXCa6y1V1s";

// Initialize Supabase client
const { createClient } = supabase;

// Database Operations Class
class SupabaseDB {
    constructor() {
        this.client = supabase;
    }

    // News Operations
    async getNews() {
        try {
            const { data, error } = await this.client
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching news:', error);
            return [];
        }
    }

    async createNews(newsData) {
        try {
            const { data, error } = await this.client
                .from('news')
                .insert([{
                    title: newsData.title,
                    description: newsData.description,
                    content: newsData.content,
                    image_url: newsData.image_url,
                    created_by: newsData.created_by,
                    published: newsData.published || true
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creating news:', error);
            throw error;
        }
    }

    async updateNews(id, newsData) {
        try {
            const { data, error } = await this.client
                .from('news')
                .update(newsData)
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating news:', error);
            throw error;
        }
    }

    async deleteNews(id) {
        try {
            const { error } = await this.client
                .from('news')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting news:', error);
            throw error;
        }
    }

    // Admin Operations
    async getAdmins() {
        try {
            const { data, error } = await this.client
                .from('admins')
                .select('*');
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching admins:', error);
            return [];
        }
    }

    async createAdmin(adminData) {
        try {
            const { data, error } = await this.client
                .from('admins')
                .insert([{
                    name: adminData.name,
                    email: adminData.email,
                    role: adminData.role,
                    password_hash: adminData.password_hash
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creating admin:', error);
            throw error;
        }
    }

    async getAdminByEmail(email) {
        try {
            const { data, error } = await this.client
                .from('admins')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching admin by email:', error);
            return null;
        }
    }

    // Intern Operations
    async getInterns() {
        try {
            const { data, error } = await this.client
                .from('interns')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching interns:', error);
            return [];
        }
    }

    async createIntern(internData) {
        try {
            const { data, error } = await this.client
                .from('interns')
                .insert([{
                    name: internData.name,
                    email: internData.email,
                    phone_number: internData.phone,
                    university: internData.university,
                    program: internData.program,
                    skills: JSON.stringify(internData.skills),
                    status: internData.status || 'active',
                    start_date: internData.startDate,
                    end_date: internData.endDate,
                    assigned_admin_id: internData.assignedAdminId
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creating intern:', error);
            throw error;
        }
    }

    async getInternByEmail(email) {
        try {
            const { data, error } = await this.client
                .from('interns')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching intern by email:', error);
            return null;
        }
    }

    async updateIntern(id, internData) {
        try {
            const { data, error } = await this.client
                .from('interns')
                .update(internData)
                .eq('intern_id', id)
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating intern:', error);
            throw error;
        }
    }

    async deleteIntern(id) {
        try {
            const { error } = await this.client
                .from('interns')
                .delete()
                .eq('intern_id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting intern:', error);
            throw error;
        }
    }

    // Task Operations
    async getTasks() {
        try {
            const { data, error } = await this.client
                .from('tasks')
                .select(`
                    *,
                    interns(name, email),
                    admins(name, email)
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching tasks:', error);
            return [];
        }
    }

    async createTask(taskData) {
        try {
            const { data, error } = await this.client
                .from('tasks')
                .insert([{
                    intern_id: taskData.internId,
                    assigned_admin_id: taskData.assignedAdminId,
                    title: taskData.title,
                    description: taskData.description,
                    deadline: taskData.deadline,
                    status: taskData.status || 'pending'
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    async updateTask(id, taskData) {
        try {
            const { data, error } = await this.client
                .from('tasks')
                .update(taskData)
                .eq('task_id', id)
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    // Attendance Operations
    async getAttendance() {
        try {
            const { data, error } = await this.client
                .from('attendance')
                .select(`
                    *,
                    interns(name, email)
                `)
                .order('date', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching attendance:', error);
            return [];
        }
    }

    async markAttendance(attendanceData) {
        try {
            const { data, error } = await this.client
                .from('attendance')
                .upsert([{
                    intern_id: attendanceData.internId,
                    date: attendanceData.date,
                    check_in_time: attendanceData.checkInTime,
                    check_out_time: attendanceData.checkOutTime,
                    status: attendanceData.status
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error marking attendance:', error);
            throw error;
        }
    }

    // Feedback Operations
    async getFeedback() {
        try {
            const { data, error } = await this.client
                .from('feedback')
                .select(`
                    *,
                    interns(name, email),
                    admins(name, email)
                `)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching feedback:', error);
            return [];
        }
    }

    async createFeedback(feedbackData) {
        try {
            const { data, error } = await this.client
                .from('feedback')
                .insert([{
                    intern_id: feedbackData.internId,
                    admin_id: feedbackData.adminId,
                    rating: feedbackData.rating,
                    comments: feedbackData.comments
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creating feedback:', error);
            throw error;
        }
    }

    // Document Operations
    async getDocuments() {
        try {
            const { data, error } = await this.client
                .from('documents')
                .select(`
                    *,
                    interns(name, email)
                `)
                .order('uploaded_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching documents:', error);
            return [];
        }
    }

    async uploadDocument(documentData) {
        try {
            const { data, error } = await this.client
                .from('documents')
                .insert([{
                    intern_id: documentData.internId,
                    title: documentData.title,
                    file_name: documentData.fileName,
                    file_path: documentData.filePath,
                    file_type: documentData.fileType
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    }
}

// Export the database instance
const db = new SupabaseDB();

// Make it available globally
window.SupabaseDB = db;
