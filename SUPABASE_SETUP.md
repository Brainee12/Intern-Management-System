# InternHive Supabase Setup Guide

This guide will help you set up Supabase for the InternHive application and connect it to your vanilla HTML/CSS/JavaScript project.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. The InternHive project files

## Step 1: Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: InternHive
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Set Up the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. You should see a success message and all tables will be created

## Step 3: Configure Row Level Security (Optional but Recommended)

The schema includes basic RLS policies, but you may want to customize them:

1. Go to **Authentication** > **Policies** in your Supabase dashboard
2. Review the policies for each table
3. Modify them according to your security requirements

## Step 4: Update Your Application Configuration

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy your **Project URL** and **anon public** key
3. Open `supabase-client.js` in your project
4. Update the configuration at the top of the file:

```javascript
const SUPABASE_URL = "YOUR_PROJECT_URL_HERE";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";
```

## Step 5: Test the Connection

1. Open `index.html` in your browser
2. Open the browser's Developer Tools (F12)
3. Go to the Console tab
4. The news section should now load data from Supabase
5. If you see any errors, check the console for details

## Step 6: Verify Database Tables

In your Supabase dashboard, go to **Table Editor** to verify all tables were created:

- ✅ `admins` - Admin user accounts
- ✅ `interns` - Intern profiles
- ✅ `tasks` - Task assignments
- ✅ `feedback` - Performance feedback
- ✅ `attendance` - Attendance records
- ✅ `documents` - Document uploads
- ✅ `news` - News articles

## Features Now Connected to Supabase

### ✅ News Section
- The landing page news carousel now loads from Supabase
- Falls back to local data if Supabase is unavailable
- Admin can manage news through the dashboard

### ✅ Database Operations Available
- **News Management**: Create, read, update, delete news articles
- **Admin Management**: Create and authenticate admin users
- **Intern Management**: Create, read, update, delete intern profiles
- **Task Management**: Assign and track tasks
- **Attendance Tracking**: Mark and monitor attendance
- **Feedback System**: Collect and manage performance feedback
- **Document Management**: Upload and organize documents

## Environment Variables (Optional)

For production deployment, consider using environment variables:

```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || "your-fallback-url";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "your-fallback-key";
```

## Troubleshooting

### Common Issues:

1. **"Failed to fetch" errors**
   - Check your Supabase URL and API key
   - Ensure your project is active in Supabase dashboard
   - Check browser console for CORS errors

2. **"relation does not exist" errors**
   - Make sure you ran the complete SQL schema
   - Check that all tables were created in the Table Editor

3. **Permission denied errors**
   - Review your RLS policies
   - Ensure the anon key has proper permissions

4. **News not loading**
   - Check the browser console for errors
   - Verify the news table has data
   - Test the Supabase connection directly

### Testing Supabase Connection

You can test the connection in the browser console:

```javascript
// Test if Supabase is connected
window.SupabaseDB.getNews().then(news => {
    console.log('News from Supabase:', news);
}).catch(error => {
    console.error('Supabase connection error:', error);
});
```

## Next Steps

1. **Authentication**: Implement proper user authentication with Supabase Auth
2. **File Storage**: Use Supabase Storage for document uploads
3. **Real-time Updates**: Add real-time subscriptions for live updates
4. **Email Notifications**: Set up email notifications for task assignments
5. **Advanced Security**: Implement more granular RLS policies

## Support

If you encounter issues:

1. Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
2. Review the browser console for error messages
3. Check the Supabase dashboard logs
4. Ensure all environment variables are correctly set

## Database Schema Overview

The database includes the following main entities:

- **Admins**: System administrators with different roles (HR, Supervisor, Mentor)
- **Interns**: Intern profiles with skills, university info, and status tracking
- **Tasks**: Project assignments with deadlines and status tracking
- **Feedback**: Performance reviews and ratings
- **Attendance**: Daily attendance tracking with check-in/out times
- **Documents**: File uploads and document management
- **News**: System announcements and updates

All tables include proper relationships, indexes, and timestamps for optimal performance and data integrity.
