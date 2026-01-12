// Admin-specific Analytics Types for School-Wide Insights

import { AnalyticsSummary, EngagementDataPoint, StudentAnalytics } from './analytics';

export interface CoursePerformance {
  courseId: string;
  courseName: string;
  teacherName: string;
  teacherEmail?: string;
  studentCount: number;
  assignmentCount: number;
  submissionRate: number;
  lateRate: number;
  averageScore?: number;
  atRiskStudents: number;
  lastActivity?: string;
}

export interface TeacherPerformance {
  userId: string;
  name: string;
  email?: string;
  photoUrl?: string;
  coursesCount: number;
  totalStudents: number;
  totalAssignments: number;
  averageSubmissionRate: number;
  averageLateRate: number;
}

export interface SchoolOverview {
  totalCourses: number;
  activeCourses: number;
  totalTeachers: number;
  totalStudents: number;
  totalAssignments: number;
  totalSubmissions: number;
  overallSubmissionRate: number;
  overallLateRate: number;
  atRiskStudentsCount: number;
  inactiveStudentsCount: number;
}

// Activity Feed Types
export interface ActivityItem {
  id: string;
  type: 'submission' | 'enrollment' | 'assignment' | 'announcement' | 'grade';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email?: string;
    photoUrl?: string;
  };
  courseName?: string;
  metadata?: {
    late?: boolean;
    grade?: number;
  };
}

// Usage Statistics
export interface UsageStats {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: number;
  assignmentsCreatedThisWeek: number;
  submissionsThisWeek: number;
  peakUsageHour: number;
  growthRate: number;
}

// Guardian/Parent Engagement
export interface GuardianStats {
  totalGuardians: number;
  activeGuardians: number;
  pendingInvites: number;
  emailsSentThisMonth: number;
  summaryOpenRate: number;
}

// AI Insights
export interface ClassroomInsight {
  id: string;
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  metric?: string;
  change?: number;
}

// School Announcements
export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  viewCount: number;
  courseCount: number;
  isActive: boolean;
}

export interface AdminAnalytics {
  overview: SchoolOverview;
  summary: AnalyticsSummary;
  engagementData: EngagementDataPoint[];
  coursePerformance: CoursePerformance[];
  teacherPerformance: TeacherPerformance[];
  atRiskStudents: StudentAnalytics[];
  topPerformingCourses: CoursePerformance[];
  lowPerformingCourses: CoursePerformance[];
  // New enhanced features
  recentActivity: ActivityItem[];
  usageStats: UsageStats;
  guardianStats: GuardianStats;
  insights: ClassroomInsight[];
  announcements: SchoolAnnouncement[];
}
