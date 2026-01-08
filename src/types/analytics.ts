// Analytics Types for Teacher Dashboard

export interface AnalyticsSummary {
  totalStudents: number;
  totalAssignments: number;
  totalSubmissions: number;
  lateSubmissions: number;
  missingSubmissions: number;
}

export interface EngagementDataPoint {
  date: string;
  submissions: number;
  formattedDate: string;
}

export interface AssignmentAnalytics {
  id: string;
  title: string;
  dueDate?: string;
  maxPoints?: number;
  submittedCount: number;
  missingCount: number;
  lateCount: number;
  totalStudents: number;
  submissionRate: number;
}

export interface StudentAnalytics {
  userId: string;
  name: string;
  email?: string;
  photoUrl?: string;
  submissionPercentage: number;
  submittedCount: number;
  missingCount: number;
  lateCount: number;
  lastSubmissionDate?: string;
  status: 'good' | 'at-risk' | 'inactive';
}

export interface CourseAnalytics {
  courseId: string;
  courseName: string;
  summary: AnalyticsSummary;
  engagementData: EngagementDataPoint[];
  assignmentStats: AssignmentAnalytics[];
  studentProgress: StudentAnalytics[];
}
