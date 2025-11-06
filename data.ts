import { User, UserRole, Course, Announcement, LeaderboardUser, Message, QuizSubmission, ScheduleEvent, Transaction } from './types';

export const users: User[] = [
  { id: 1, name: 'JOY', email: 'joy@edupro.com', role: UserRole.Learner, avatar: 'https://picsum.photos/seed/joy/100/100', password: 'password123' },
  { id: 2, name: 'Mrs. Lopez', email: 'lopez@edupro.com', role: UserRole.Instructor, avatar: 'https://picsum.photos/seed/lopez/100/100', password: 'password123' },
  { id: 3, name: 'Sam Chen', email: 'sam@edupro.com', role: UserRole.Admin, avatar: 'https://picsum.photos/seed/sam/100/100', password: 'password123' },
  { id: 4, name: 'CHEN', email: 'chen@edupro.com', role: UserRole.Learner, avatar: 'https://picsum.photos/seed/chen/100/100', password: 'password123' },
  { id: 5, name: 'LEA', email: 'lea@edupro.com', role: UserRole.Learner, avatar: 'https://picsum.photos/seed/lea/100/100', password: 'password123' },
  { id: 6, name: 'Mr. Buatis', email: 'buatis@edupro.com', role: UserRole.Instructor, avatar: 'https://picsum.photos/seed/buatis/100/100', password: 'password123' },
  { id: 7, name: 'JOANNE', email: 'joanne@edupro.com', role: UserRole.Learner, avatar: 'https://picsum.photos/seed/joanne/100/100', password: 'password123' },
  { id: 8, name: 'JAWAD', email: 'jawad@edupro.com', role: UserRole.Learner, avatar: 'https://picsum.photos/seed/jawad/100/100', password: 'password123' },
];

export const courses: Course[] = [
  {
    id: 1,
    title: 'CPA Review: Financial Accounting',
    subject: 'Accounting',
    instructor: 'Mrs. Lopez',
    progress: 75,
    modules: [
      { id: 1, title: 'The Conceptual Framework', type: 'Video', completed: true, duration: 45 },
      { id: 2, title: 'Income Statement & Related Info', type: 'PDF', completed: true, duration: 30 },
      { id: 3, title: 'Balance Sheet & Statement of Cash Flows', type: 'Video', completed: false, duration: 60 },
      { 
        id: 4, 
        title: 'Diagnostic Exam 1', 
        type: 'Quiz', 
        completed: false, 
        duration: 20,
        questions: [
          { id: 1, text: 'What is the primary purpose of the balance sheet?', options: ['To report revenues and expenses', 'To report assets, liabilities, and equity', 'To report cash inflows and outflows', 'To report changes in equity'], correctAnswerIndex: 1 },
          { id: 2, text: 'Which of these is NOT an asset?', options: ['Accounts Receivable', 'Inventory', 'Prepaid Insurance', 'Accounts Payable'], correctAnswerIndex: 3 },
        ]
      },
    ],
  },
  {
    id: 2,
    title: 'CPA Review: Taxation',
    subject: 'Taxation',
    instructor: 'Mr. Buatis',
    progress: 40,
    modules: [
      { id: 1, title: 'Individual Income Tax Formula', type: 'Video', completed: true, duration: 50 },
      { id: 2, title: 'Gross Income and Exclusions', type: 'Video', completed: false, duration: 55 },
      { id: 3, title: 'Deductions and Losses', type: 'PDF', completed: false, duration: 25 },
    ],
  },
  {
    id: 3,
    title: 'CPA Review: Management Services',
    subject: 'Accounting',
    instructor: 'Mrs. Lopez',
    progress: 100,
     modules: [
      { id: 1, title: 'Cost Concepts and Classifications', type: 'Video', completed: true, duration: 60 },
      { id: 2, title: 'Cost-Volume-Profit Relationships', type: 'Video', completed: true, duration: 45 },
      { id: 3, title: 'Budgeting for Planning and Control', type: 'PDF', completed: true, duration: 90 },
      { 
        id: 4, 
        title: 'Final Pre-board Exam', 
        type: 'Quiz', 
        completed: true, 
        duration: 120,
        questions: [
           { id: 1, text: 'Which is a characteristic of managerial accounting?', options: ['Focuses on historical data', 'Is governed by GAAP', 'Provides information for internal users', 'Is primarily for investors'], correctAnswerIndex: 2 },
           { id: 2, text: 'Fixed costs per unit...', options: ['Decrease as activity increases', 'Increase as activity increases', 'Remain constant regardless of activity', 'Are not relevant to decision making'], correctAnswerIndex: 0 },
           { id: 3, text: 'What is contribution margin?', options: ['Sales - Cost of Goods Sold', 'Sales - Variable Costs', 'Sales - Fixed Costs', 'Sales - Total Costs'], correctAnswerIndex: 1 },
        ]
      },
    ],
  },
];

export const announcements: Announcement[] = [
  { id: 1, title: 'System Maintenance', content: 'The system will be down for maintenance on Sunday at 2 AM.', authorId: 3, date: '2024-07-20' },
  { id: 2, title: 'New Review Batch Open', content: 'Enrollment for the October 2025 batch is now open!', authorId: 3, date: '2024-07-18' },
  { id: 3, title: 'Diagnostic Exam Reminder', content: 'Just a reminder that the first diagnostic exam for Financial Accounting is this Friday. Good luck studying!', authorId: 2, date: '2024-07-22', courseId: 1 },
  { id: 4, title: 'Welcome Reviewees!', content: 'Welcome everyone to the Taxation review. Please review the syllabus in the first module.', authorId: 6, date: '2024-07-21', courseId: 2 },
];

export const leaderboardData: LeaderboardUser[] = [
    { id: 1, name: 'JOY', avatar: 'https://picsum.photos/seed/joy/100/100', points: 2450 },
    { id: 4, name: 'CHEN', avatar: 'https://picsum.photos/seed/chen/100/100', points: 2100 },
    { id: 5, name: 'LEA', avatar: 'https://picsum.photos/seed/lea/100/100', points: 1850 },
    { id: 7, name: 'JOANNE', avatar: 'https://picsum.photos/seed/joanne/100/100', points: 1500 },
    { id: 8, name: 'JAWAD', avatar: 'https://picsum.photos/seed/jawad/100/100', points: 1200 },
];

export const analyticsData = {
    userActivity: [
        { name: 'Mon', Learners: 30, Instructors: 5, Admins: 2 },
        { name: 'Tue', Learners: 45, Instructors: 6, Admins: 2 },
        { name: 'Wed', Learners: 50, Instructors: 7, Admins: 3 },
        { name: 'Thu', Learners: 62, Instructors: 8, Admins: 3 },
        { name: 'Fri', Learners: 70, Instructors: 8, Admins: 3 },
        { name: 'Sat', Learners: 40, Instructors: 4, Admins: 1 },
        { name: 'Sun', Learners: 25, Instructors: 3, Admins: 1 },
    ],
    moduleCompletions: [
        { name: 'Jan', completions: 120 },
        { name: 'Feb', completions: 180 },
        { name: 'Mar', completions: 250 },
        { name: 'Apr', completions: 230 },
        { name: 'May', completions: 310 },
        { name: 'Jun', completions: 400 },
    ],
};

export const messages: Message[] = [
  { id: 1, senderId: 1, receiverId: 2, text: 'Hello Mrs. Lopez, I have a question about the balance sheet.', timestamp: '2024-07-22T10:00:00Z' },
  { id: 2, senderId: 2, receiverId: 1, text: 'Hi JOY, of course. What would you like to know?', timestamp: '2024-07-22T10:05:00Z' },
  { id: 3, senderId: 1, receiverId: 2, text: 'I\'m struggling with the difference between current and non-current assets. Could you explain?', timestamp: '2024-07-22T10:06:00Z' },
  { id: 4, senderId: 2, receiverId: 1, text: 'Certainly. Current assets are expected to be converted to cash within one year, like inventory. Non-current assets are long-term, like buildings or equipment.', timestamp: '2024-07-22T10:15:00Z' },
  { id: 5, senderId: 4, receiverId: 6, text: 'Hi Mr. Buatis, when is the next assignment due?', timestamp: '2024-07-21T14:30:00Z' },
  { id: 6, senderId: 6, receiverId: 4, text: 'Hi CHEN, it is due this Friday at 11:59 PM. You can find the details in the "Assignments" module.', timestamp: '2024-07-21T15:00:00Z' },
];

export const quizSubmissions: QuizSubmission[] = [
    { id: 1, moduleId: 4, studentId: 1, score: 1, totalQuestions: 2, timestamp: '2024-07-23T14:00:00Z' },
    { id: 2, moduleId: 4, studentId: 4, score: 2, totalQuestions: 2, timestamp: '2024-07-23T15:30:00Z' },
    { id: 3, moduleId: 4, studentId: 5, score: 0, totalQuestions: 2, timestamp: '2024-07-23T16:00:00Z' },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);
nextWeek.setHours(14, 0, 0, 0);

export const scheduleEvents: ScheduleEvent[] = [
    {
        id: 1,
        title: 'Diagnostic Exam',
        type: 'Exam',
        courseId: 1,
        instructorId: 2,
        startTime: tomorrow.toISOString(),
        endTime: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000).toISOString(),
        description: 'Covers modules 1-3. Please be on time.'
    },
    {
        id: 2,
        title: 'Taxation Weekly Lecture',
        type: 'Class',
        courseId: 2,
        instructorId: 6,
        startTime: nextWeek.toISOString(),
        endTime: new Date(nextWeek.getTime() + 90 * 60 * 1000).toISOString(),
        description: 'Topic: Advanced Deductions. Reading materials are available in Module 4.'
    }
];

export const transactions: Transaction[] = [
  { id: 1, description: 'CPA Review Package (May 2025 Batch)', amount: 15500.75, date: '2024-08-01', status: 'Unpaid' },
  { id: 2, description: 'Review Materials & Handouts Fee', amount: 350.00, date: '2024-08-01', status: 'Unpaid' },
  { id: 3, description: 'Reservation Fee', amount: 500.00, date: '2024-06-15', status: 'Paid' },
  { id: 4, description: 'Bookstore Purchase: Reviewers', amount: 1250.50, date: '2024-06-20', status: 'Paid' },
];
