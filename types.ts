export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export enum UserRole {
  Admin = 'Admin',
  Instructor = 'Instructor',
  Learner = 'Learner',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  password?: string;
}

export interface Module {
  id: number;
  title: string;
  type: 'Video' | 'PDF' | 'Quiz' | 'PPT';
  completed: boolean;
  duration: number; // in minutes
  questions?: Question[];
}

export interface Course {
  id: number;
  title: string;
  subject: string;
  instructor: string;
  progress: number;
  modules: Module[];
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  authorId: number;
  date: string;
  courseId?: number; // Optional: for course-specific announcements
}

export interface Badge {
    id: number;
    name: string;
    icon: string;
    description: string;
}

export interface LeaderboardUser {
    id: number;
    name: string;
    avatar: string;
    points: number;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
}

export interface QuizSubmission {
  id: number;
  moduleId: number;
  studentId: number;
  score: number;
  totalQuestions: number;
  timestamp: string;
}

export interface ScheduleEvent {
  id: number;
  title: string;
  type: 'Class' | 'Exam';
  courseId: number;
  instructorId: number;
  startTime: string; // ISO string
  endTime: string; // ISO string
  description: string;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Unpaid';
}
