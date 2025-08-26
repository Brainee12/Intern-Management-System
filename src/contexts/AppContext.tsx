import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'HR' | 'Supervisor' | 'Mentor';
  createdAt: string;
}

export interface Intern {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  program: string;
  skills: string[];
  status: 'active' | 'completed' | 'dropped';
  startDate: string;
  endDate: string;
  assignedAdminId: string;
  profileImage?: string;
}

export interface Task {
  id: string;
  internId: string;
  assignedAdminId: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
  submissionUrl?: string;
  submittedAt?: string;
  submissionFileName?: string;
  submissionComment?: string;
}

export interface Feedback {
  id: string;
  internId: string;
  adminId: string;
  rating: number;
  comments: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  internId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'absent' | 'late';
}

export interface Document {
  id: string;
  internId: string;
  title: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  fileType?: string;
  fileSize?: number;
  type?: 'resume' | 'certificate' | 'assignment' | 'report' | 'resource';
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image: string;
  createdBy: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'intern';
  isLoggedIn: boolean;
}

interface AppState {
  currentUser: User | null;
  interns: Intern[];
  admins: Admin[];
  tasks: Task[];
  feedback: Feedback[];
  attendance: Attendance[];
  documents: Document[];
  news: NewsItem[];
}

type Action =
  | { type: 'LOGIN_USER'; payload: User }
  | { type: 'LOGOUT_USER' }
  | { type: 'ADD_INTERN'; payload: Intern }
  | { type: 'UPDATE_INTERN'; payload: Intern }
  | { type: 'DELETE_INTERN'; payload: string }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_FEEDBACK'; payload: Feedback }
  | { type: 'UPDATE_FEEDBACK'; payload: Feedback }
  | { type: 'ADD_ATTENDANCE'; payload: Attendance }
  | { type: 'UPDATE_ATTENDANCE'; payload: Attendance }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'ADD_NEWS'; payload: NewsItem }
  | { type: 'UPDATE_NEWS'; payload: NewsItem }
  | { type: 'DELETE_NEWS'; payload: string };

const initialState: AppState = {
  currentUser: null,
  interns: [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '(555) 123-4567',
      university: 'MIT',
      program: 'Computer Science',
      skills: ['React', 'JavaScript', 'Python'],
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      assignedAdminId: '1'
    },
    {
      id: '2', 
      name: 'Bob Smith',
      email: 'bob@example.com',
      phone: '(555) 987-6543',
      university: 'Stanford',
      program: 'Data Science',
      skills: ['Python', 'Machine Learning', 'SQL'],
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-07-01',
      assignedAdminId: '1'
    }
  ],
  admins: [
    {
      id: '1',
      name: 'Dr. Sarah Wilson',
      email: 'admin@company.com',
      role: 'HR',
      createdAt: '2024-01-01'
    }
  ],
  tasks: [
    {
      id: '1',
      internId: '1',
      assignedAdminId: '1',
      title: 'React Dashboard Development',
      description: 'Build a responsive dashboard using React and TypeScript',
      deadline: '2024-03-15',
      status: 'in-progress'
    },
    {
      id: '2',
      internId: '2',
      assignedAdminId: '1', 
      title: 'Data Analysis Report',
      description: 'Analyze customer data and create visualization report',
      deadline: '2024-03-20',
      status: 'pending'
    }
  ],
  feedback: [],
  attendance: [],
  documents: [],
  news: [
    {
      id: '1',
      title: 'New AI-Powered Task Assignment Feature',
      description: 'InternHive now uses intelligent matching to assign the best tasks to interns based on their skills and interests.',
      date: 'Dec 20, 2024',
      image: '/hero-image.jpg',
      createdBy: '1',
      createdAt: '2024-12-20T00:00:00Z'
    },
    {
      id: '2',
      title: 'Real-Time Performance Analytics Dashboard',
      description: 'Track intern progress with comprehensive analytics, including performance trends and achievement milestones.',
      date: 'Dec 15, 2024',
      image: '/hero-image.jpg',
      createdBy: '1',
      createdAt: '2024-12-15T00:00:00Z'
    },
    {
      id: '3',
      title: 'Mobile App Now Available',
      description: 'Access InternHive on the go with our new mobile application for both iOS and Android platforms.',
      date: 'Dec 10, 2024',
      image: '/hero-image.jpg',
      createdBy: '1',
      createdAt: '2024-12-10T00:00:00Z'
    }
  ]
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN_USER':
      return { ...state, currentUser: action.payload };
    case 'LOGOUT_USER':
      return { ...state, currentUser: null };
    case 'ADD_INTERN':
      return { ...state, interns: [...state.interns, action.payload] };
    case 'UPDATE_INTERN':
      return {
        ...state,
        interns: state.interns.map(intern => 
          intern.id === action.payload.id ? action.payload : intern
        )
      };
    case 'DELETE_INTERN':
      return {
        ...state,
        interns: state.interns.filter(intern => intern.id !== action.payload)
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };
    case 'ADD_FEEDBACK':
      return { ...state, feedback: [...state.feedback, action.payload] };
    case 'UPDATE_FEEDBACK':
      return {
        ...state,
        feedback: state.feedback.map(fb =>
          fb.id === action.payload.id ? action.payload : fb
        )
      };
    case 'ADD_ATTENDANCE':
      return { ...state, attendance: [...state.attendance, action.payload] };
    case 'UPDATE_ATTENDANCE':
      return {
        ...state,
        attendance: state.attendance.map(att =>
          att.id === action.payload.id ? action.payload : att
        )
      };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload)
      };
    case 'ADD_NEWS':
      return { ...state, news: [...state.news, action.payload] };
    case 'UPDATE_NEWS':
      return {
        ...state,
        news: state.news.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'DELETE_NEWS':
      return {
        ...state,
        news: state.news.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
