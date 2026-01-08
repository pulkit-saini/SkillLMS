import { classroomService, Course, CourseWork, StudentSubmission, Student } from './classroomService';
import {
  AnalyticsSummary,
  EngagementDataPoint,
  AssignmentAnalytics,
  StudentAnalytics,
  CourseAnalytics,
} from '@/types/analytics';
import { format, parseISO, subDays } from 'date-fns';

/**
 * Service for computing analytics from Google Classroom data.
 * All API calls are abstracted here to keep UI components clean.
 */
export const classroomAnalyticsService = {
  /**
   * Fetch all courses where user is a teacher
   */
  getTeacherCourses: async (token: string): Promise<Course[]> => {
    const allCourses = await classroomService.getCourses(token);
    const teacherCourses: Course[] = [];
    
    for (const course of allCourses) {
      const role = await classroomService.getUserRoleInCourse(token, course.id);
      if (role === 'teacher') {
        teacherCourses.push(course);
      }
    }
    
    return teacherCourses;
  },

  /**
   * Fetch complete analytics for a course
   */
  getCourseAnalytics: async (token: string, courseId: string, courseName: string): Promise<CourseAnalytics> => {
    // Fetch all required data in parallel
    const [courseWork, students] = await Promise.all([
      classroomService.getCourseWork(token, courseId),
      classroomService.getStudents(token, courseId),
    ]);

    // Fetch all submissions for each assignment
    const submissionsByWork: Record<string, StudentSubmission[]> = {};
    for (const work of courseWork) {
      submissionsByWork[work.id] = await classroomService.getAllStudentSubmissions(token, courseId, work.id);
    }

    // Compute analytics
    const summary = computeSummary(courseWork, students, submissionsByWork);
    const engagementData = computeEngagementData(submissionsByWork);
    const assignmentStats = computeAssignmentStats(courseWork, students.length, submissionsByWork);
    const studentProgress = computeStudentProgress(students, courseWork, submissionsByWork);

    return {
      courseId,
      courseName,
      summary,
      engagementData,
      assignmentStats,
      studentProgress,
    };
  },

  /**
   * Fetch aggregated analytics across all teacher courses
   */
  getAggregatedAnalytics: async (token: string): Promise<CourseAnalytics | null> => {
    const courses = await classroomAnalyticsService.getTeacherCourses(token);
    
    if (courses.length === 0) return null;

    // Get analytics for each course
    const courseAnalytics: CourseAnalytics[] = [];
    for (const course of courses) {
      try {
        const analytics = await classroomAnalyticsService.getCourseAnalytics(token, course.id, course.name);
        courseAnalytics.push(analytics);
      } catch (error) {
        console.warn(`Failed to get analytics for course ${course.id}:`, error);
      }
    }

    if (courseAnalytics.length === 0) return null;

    // Aggregate all analytics
    return aggregateCourseAnalytics(courseAnalytics);
  },
};

// ==================== HELPER FUNCTIONS ====================

function computeSummary(
  courseWork: CourseWork[],
  students: Student[],
  submissionsByWork: Record<string, StudentSubmission[]>
): AnalyticsSummary {
  const totalStudents = students.length;
  const totalAssignments = courseWork.length;
  
  let totalSubmissions = 0;
  let lateSubmissions = 0;
  let missingSubmissions = 0;

  for (const work of courseWork) {
    const submissions = submissionsByWork[work.id] || [];
    
    for (const sub of submissions) {
      if (sub.state === 'TURNED_IN' || sub.state === 'RETURNED') {
        totalSubmissions++;
        if (sub.late) lateSubmissions++;
      } else if (sub.state === 'NEW' || sub.state === 'CREATED') {
        // Check if past due
        if (work.dueDate) {
          const dueDate = new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day);
          if (new Date() > dueDate) {
            missingSubmissions++;
          }
        }
      }
    }
  }

  return {
    totalStudents,
    totalAssignments,
    totalSubmissions,
    lateSubmissions,
    missingSubmissions,
  };
}

function computeEngagementData(
  submissionsByWork: Record<string, StudentSubmission[]>
): EngagementDataPoint[] {
  const submissionsByDate: Record<string, number> = {};
  
  // Initialize last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    submissionsByDate[date] = 0;
  }

  // Count submissions by date
  for (const workId of Object.keys(submissionsByWork)) {
    const submissions = submissionsByWork[workId];
    for (const sub of submissions) {
      if ((sub.state === 'TURNED_IN' || sub.state === 'RETURNED') && sub.updateTime) {
        const date = format(parseISO(sub.updateTime), 'yyyy-MM-dd');
        if (submissionsByDate[date] !== undefined) {
          submissionsByDate[date]++;
        }
      }
    }
  }

  return Object.entries(submissionsByDate).map(([date, submissions]) => ({
    date,
    submissions,
    formattedDate: format(parseISO(date), 'MMM d'),
  }));
}

function computeAssignmentStats(
  courseWork: CourseWork[],
  totalStudents: number,
  submissionsByWork: Record<string, StudentSubmission[]>
): AssignmentAnalytics[] {
  return courseWork.map((work) => {
    const submissions = submissionsByWork[work.id] || [];
    
    let submittedCount = 0;
    let lateCount = 0;
    
    for (const sub of submissions) {
      if (sub.state === 'TURNED_IN' || sub.state === 'RETURNED') {
        submittedCount++;
        if (sub.late) lateCount++;
      }
    }

    const missingCount = totalStudents - submittedCount;
    const submissionRate = totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;

    let dueDate: string | undefined;
    if (work.dueDate) {
      dueDate = format(
        new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day),
        'MMM d, yyyy'
      );
    }

    return {
      id: work.id,
      title: work.title,
      dueDate,
      maxPoints: work.maxPoints,
      submittedCount,
      missingCount,
      lateCount,
      totalStudents,
      submissionRate,
    };
  });
}

function computeStudentProgress(
  students: Student[],
  courseWork: CourseWork[],
  submissionsByWork: Record<string, StudentSubmission[]>
): StudentAnalytics[] {
  const totalAssignments = courseWork.length;

  return students.map((student) => {
    let submittedCount = 0;
    let lateCount = 0;
    let lastSubmissionDate: string | undefined;

    for (const work of courseWork) {
      const submissions = submissionsByWork[work.id] || [];
      const studentSub = submissions.find((s) => s.userId === student.userId);

      if (studentSub) {
        if (studentSub.state === 'TURNED_IN' || studentSub.state === 'RETURNED') {
          submittedCount++;
          if (studentSub.late) lateCount++;
          
          if (studentSub.updateTime) {
            if (!lastSubmissionDate || studentSub.updateTime > lastSubmissionDate) {
              lastSubmissionDate = studentSub.updateTime;
            }
          }
        }
      }
    }

    const missingCount = totalAssignments - submittedCount;
    const submissionPercentage = totalAssignments > 0 
      ? Math.round((submittedCount / totalAssignments) * 100) 
      : 0;

    // Determine status
    let status: 'good' | 'at-risk' | 'inactive';
    if (submissionPercentage >= 80) {
      status = 'good';
    } else if (submissionPercentage >= 50) {
      status = 'at-risk';
    } else {
      status = 'inactive';
    }

    return {
      userId: student.userId,
      name: student.profile?.name?.fullName || 'Unknown Student',
      email: student.profile?.emailAddress,
      photoUrl: student.profile?.photoUrl,
      submissionPercentage,
      submittedCount,
      missingCount,
      lateCount,
      lastSubmissionDate: lastSubmissionDate 
        ? format(parseISO(lastSubmissionDate), 'MMM d, yyyy')
        : undefined,
      status,
    };
  });
}

function aggregateCourseAnalytics(courseAnalytics: CourseAnalytics[]): CourseAnalytics {
  // Aggregate summary
  const summary: AnalyticsSummary = {
    totalStudents: 0,
    totalAssignments: 0,
    totalSubmissions: 0,
    lateSubmissions: 0,
    missingSubmissions: 0,
  };

  for (const ca of courseAnalytics) {
    summary.totalStudents += ca.summary.totalStudents;
    summary.totalAssignments += ca.summary.totalAssignments;
    summary.totalSubmissions += ca.summary.totalSubmissions;
    summary.lateSubmissions += ca.summary.lateSubmissions;
    summary.missingSubmissions += ca.summary.missingSubmissions;
  }

  // Aggregate engagement data
  const engagementMap: Record<string, EngagementDataPoint> = {};
  for (const ca of courseAnalytics) {
    for (const point of ca.engagementData) {
      if (!engagementMap[point.date]) {
        engagementMap[point.date] = { ...point };
      } else {
        engagementMap[point.date].submissions += point.submissions;
      }
    }
  }
  const engagementData = Object.values(engagementMap).sort((a, b) => 
    a.date.localeCompare(b.date)
  );

  // Combine all assignment stats
  const assignmentStats: AssignmentAnalytics[] = [];
  for (const ca of courseAnalytics) {
    assignmentStats.push(...ca.assignmentStats);
  }

  // Combine all student progress (unique students)
  const studentMap: Record<string, StudentAnalytics> = {};
  for (const ca of courseAnalytics) {
    for (const student of ca.studentProgress) {
      if (!studentMap[student.userId]) {
        studentMap[student.userId] = { ...student };
      }
    }
  }
  const studentProgress = Object.values(studentMap);

  return {
    courseId: 'all',
    courseName: 'All Courses',
    summary,
    engagementData,
    assignmentStats,
    studentProgress,
  };
}
