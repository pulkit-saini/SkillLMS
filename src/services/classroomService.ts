import axios from 'axios';

const BASE_URL = 'https://classroom.googleapis.com/v1';

const getHeaders = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

export interface Course {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  description?: string;
  room?: string;
  alternateLink?: string;
  courseState?: string;
  ownerId?: string;
  enrollmentCode?: string;
  creationTime?: string;
  updateTime?: string;
  teacherFolder?: {
    id: string;
    title: string;
    alternateLink: string;
  };
}

export interface CourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  materials?: Material[];
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  dueDate?: { year: number; month: number; day: number };
  dueTime?: { hours: number; minutes: number };
  maxPoints?: number;
  workType?: string;
  submission?: StudentSubmission;
}

export interface StudentSubmission {
  id: string;
  courseId: string;
  courseWorkId: string;
  userId: string;
  creationTime?: string;
  updateTime?: string;
  state: 'NEW' | 'CREATED' | 'TURNED_IN' | 'RETURNED' | 'RECLAIMED_BY_STUDENT';
  late?: boolean;
  assignedGrade?: number;
  alternateLink?: string;
  assignmentSubmission?: {
    attachments?: Attachment[];
  };
}

export interface Announcement {
  id: string;
  courseId: string;
  text: string;
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
  creatorUserId?: string;
  materials?: Material[];
}

export interface Material {
  driveFile?: {
    driveFile: {
      id: string;
      title: string;
      alternateLink: string;
      thumbnailUrl?: string;
    };
    shareMode?: string;
  };
  youtubeVideo?: {
    id: string;
    title: string;
    alternateLink: string;
    thumbnailUrl?: string;
  };
  link?: {
    url: string;
    title?: string;
    thumbnailUrl?: string;
  };
  form?: {
    formUrl: string;
    title?: string;
    thumbnailUrl?: string;
  };
}

export interface Attachment {
  driveFile?: {
    id: string;
    title: string;
    alternateLink: string;
    thumbnailUrl?: string;
  };
  youTubeVideo?: {
    id: string;
    title: string;
    alternateLink: string;
    thumbnailUrl?: string;
  };
  link?: {
    url: string;
    title?: string;
    thumbnailUrl?: string;
  };
  form?: {
    formUrl: string;
    title?: string;
    thumbnailUrl?: string;
  };
}

export interface Teacher {
  courseId: string;
  userId: string;
  profile?: UserProfile;
}

export interface Student {
  courseId: string;
  userId: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  name?: {
    givenName: string;
    familyName: string;
    fullName: string;
  };
  emailAddress?: string;
  photoUrl?: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  materials?: Material[];
  state?: string;
  alternateLink?: string;
  creationTime?: string;
  updateTime?: string;
}

// Platform course identifier
const PLATFORM_TAG = 'SkillLMS';

/**
 * Check if a course belongs to our platform by looking for the platform tag in the section field.
 * @param course - The course to check
 * @returns true if the course belongs to SkillLMS platform
 */
export const isPlatformCourse = (course: Course): boolean => {
  if (!course.section) return false;
  return course.section.toLowerCase().includes(PLATFORM_TAG.toLowerCase());
};

// Error helper with location tracking
const handleApiError = (error: any, location: string): never => {
  const status = error.response?.status;
  const apiMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
  const errorDetails = `[${location}] Status: ${status}, Message: ${apiMessage}`;
  console.error(`API Error at ${location}:`, { status, apiMessage, fullError: error.response?.data });
  throw new Error(errorDetails);
};

export const classroomService = {
  // ==================== COURSES ====================
  getCourses: async (token: string): Promise<Course[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/courses`, getHeaders(token));
      return response.data.courses || [];
    } catch (error: any) {
      throw handleApiError(error, 'getCourses');
    }
  },

  getCourse: async (token: string, courseId: string): Promise<Course> => {
    try {
      const response = await axios.get(`${BASE_URL}/courses/${courseId}`, getHeaders(token));
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, `getCourse(${courseId})`);
    }
  },

  // ==================== COURSEWORK ====================
  getCourseWork: async (token: string, courseId: string): Promise<CourseWork[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/courseWork`,
        getHeaders(token)
      );
      return response.data.courseWork || [];
    } catch (error: any) {
      throw handleApiError(error, `getCourseWork(${courseId})`);
    }
  },

  getCourseWorkItem: async (token: string, courseId: string, courseWorkId: string): Promise<CourseWork> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}`,
        getHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, `getCourseWorkItem(${courseId}, ${courseWorkId})`);
    }
  },

  // ==================== SUBMISSIONS ====================
  getSubmission: async (token: string, courseId: string, courseWorkId: string): Promise<StudentSubmission | null> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions?userId=me`,
        getHeaders(token)
      );
      return response.data.studentSubmissions ? response.data.studentSubmissions[0] : null;
    } catch (error: any) {
      console.warn(`getSubmission(${courseId}, ${courseWorkId}) failed:`, error.response?.data?.error?.message);
      return null;
    }
  },

  getAllSubmissions: async (token: string, courseId: string): Promise<StudentSubmission[]> => {
    try {
      const courseWork = await classroomService.getCourseWork(token, courseId);
      const submissions: StudentSubmission[] = [];
      
      for (const work of courseWork) {
        const submission = await classroomService.getSubmission(token, courseId, work.id);
        if (submission) {
          submissions.push(submission);
        }
      }
      
      return submissions;
    } catch (error: any) {
      console.warn(`getAllSubmissions(${courseId}) failed:`, error.message);
      return [];
    }
  },

  addLink: async (token: string, courseId: string, courseWorkId: string, submissionId: string, linkUrl: string) => {
    try {
      const body = {
        addAttachments: [{ link: { url: linkUrl } }]
      };
      return await axios.post(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:modifyAttachments`,
        body,
        getHeaders(token)
      );
    } catch (error: any) {
      throw handleApiError(error, `addLink(${courseId}, ${courseWorkId}, ${submissionId})`);
    }
  },

  addDriveFile: async (token: string, courseId: string, courseWorkId: string, submissionId: string, driveFileId: string) => {
    try {
      const body = {
        addAttachments: [{ driveFile: { id: driveFileId } }]
      };
      return await axios.post(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:modifyAttachments`,
        body,
        getHeaders(token)
      );
    } catch (error: any) {
      throw handleApiError(error, `addDriveFile(${courseId}, ${courseWorkId}, ${submissionId})`);
    }
  },

  turnIn: async (token: string, courseId: string, courseWorkId: string, submissionId: string) => {
    try {
      return await axios.post(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:turnIn`,
        {},
        getHeaders(token)
      );
    } catch (error: any) {
      throw handleApiError(error, `turnIn(${courseId}, ${courseWorkId}, ${submissionId})`);
    }
  },

  reclaim: async (token: string, courseId: string, courseWorkId: string, submissionId: string) => {
    try {
      return await axios.post(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:reclaim`,
        {},
        getHeaders(token)
      );
    } catch (error: any) {
      throw handleApiError(error, `reclaim(${courseId}, ${courseWorkId}, ${submissionId})`);
    }
  },

  // ==================== ANNOUNCEMENTS ====================
  getAnnouncements: async (token: string, courseId: string): Promise<Announcement[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/announcements`,
        getHeaders(token)
      );
      return response.data.announcements || [];
    } catch (error: any) {
      console.warn(`getAnnouncements(${courseId}) failed:`, error.response?.data?.error?.message);
      return [];
    }
  },

  // ==================== COURSE MATERIALS ====================
  getCourseMaterials: async (token: string, courseId: string): Promise<CourseMaterial[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/courseWorkMaterials`,
        getHeaders(token)
      );
      return response.data.courseWorkMaterial || [];
    } catch (error: any) {
      console.warn(`getCourseMaterials(${courseId}) failed:`, error.response?.data?.error?.message);
      return [];
    }
  },

  // ==================== TEACHERS & STUDENTS ====================
  getTeachers: async (token: string, courseId: string): Promise<Teacher[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/teachers`,
        getHeaders(token)
      );
      return response.data.teachers || [];
    } catch (error: any) {
      console.warn(`getTeachers(${courseId}) failed:`, error.response?.data?.error?.message);
      return [];
    }
  },

  getStudents: async (token: string, courseId: string): Promise<Student[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/students`,
        getHeaders(token)
      );
      return response.data.students || [];
    } catch (error: any) {
      console.warn(`getStudents(${courseId}) failed:`, error.response?.data?.error?.message);
      return [];
    }
  },

  // ==================== USER PROFILE ====================
  getUserProfile: async (token: string): Promise<UserProfile> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/userProfiles/me`,
        getHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'getUserProfile');
    }
  },

  // ==================== USER ROLE DETECTION ====================
  getUserRoleInCourse: async (token: string, courseId: string): Promise<'teacher' | 'student' | 'unknown'> => {
    try {
      const teachers = await classroomService.getTeachers(token, courseId);
      const profile = await classroomService.getUserProfile(token);
      
      const isTeacher = teachers.some(t => t.userId === profile.id);
      if (isTeacher) return 'teacher';

      const students = await classroomService.getStudents(token, courseId);
      const isStudent = students.some(s => s.userId === profile.id);
      if (isStudent) return 'student';

      return 'unknown';
    } catch (error: any) {
      console.warn(`getUserRoleInCourse(${courseId}) failed:`, error.message);
      return 'unknown';
    }
  },

  // ==================== GLOBAL ROLE DETECTION ====================
  detectUserRole: async (token: string, adminEmails: string[] = []): Promise<'admin' | 'teacher' | 'student'> => {
    try {
      const adminSet = new Set(adminEmails.map((e) => e.trim().toLowerCase()).filter(Boolean));

      const profile = await classroomService.getUserProfile(token);

      // Prefer Classroom profile email when available; fallback to Google userinfo email.
      let email = profile.emailAddress?.toLowerCase();
      if (!email && adminSet.size > 0) {
        try {
          const userinfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` },
          });
          email = (userinfo.data?.email as string | undefined)?.toLowerCase();
        } catch {
          // If userinfo fails, continue without email-based admin detection.
        }
      }

      if (email && adminSet.has(email)) {
        return 'admin';
      }

      // Check if user teaches any courses
      const courses = await classroomService.getCourses(token);
      for (const course of courses) {
        const teachers = await classroomService.getTeachers(token, course.id);
        const isTeacher = teachers.some((t) => t.userId === profile.id);
        if (isTeacher) return 'teacher';
      }

      return 'student';
    } catch (error: any) {
      console.warn('detectUserRole failed:', error.message);
      return 'student';
    }
  },

  // ==================== COURSE CREATION (TEACHER) ====================
  createCourse: async (token: string, courseData: { name: string; section?: string; description?: string; room?: string }): Promise<Course> => {
    try {
      const response = await axios.post(`${BASE_URL}/courses`, courseData, getHeaders(token));
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, 'createCourse');
    }
  },

  updateCourse: async (token: string, courseId: string, courseData: Partial<Course>): Promise<Course> => {
    try {
      const response = await axios.patch(`${BASE_URL}/courses/${courseId}`, courseData, getHeaders(token));
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, `updateCourse(${courseId})`);
    }
  },

  // ==================== COURSEWORK CREATION (TEACHER) ====================
  createCourseWork: async (
    token: string,
    courseId: string,
    workData: {
      title: string;
      description?: string;
      workType: 'ASSIGNMENT' | 'SHORT_ANSWER_QUESTION' | 'MULTIPLE_CHOICE_QUESTION';
      maxPoints?: number;
      dueDate?: { year: number; month: number; day: number };
      dueTime?: { hours: number; minutes: number };
      state?: 'PUBLISHED' | 'DRAFT';
    }
  ): Promise<CourseWork> => {
    try {
      const body = {
        ...workData,
        state: workData.state || 'PUBLISHED',
      };
      const response = await axios.post(
        `${BASE_URL}/courses/${courseId}/courseWork`,
        body,
        getHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, `createCourseWork(${courseId})`);
    }
  },

  // ==================== GRADING (TEACHER) ====================
  getAllStudentSubmissions: async (token: string, courseId: string, courseWorkId: string): Promise<StudentSubmission[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions`,
        getHeaders(token)
      );
      return response.data.studentSubmissions || [];
    } catch (error: any) {
      console.warn(`getAllStudentSubmissions failed:`, error.response?.data?.error?.message);
      return [];
    }
  },

  gradeSubmission: async (
    token: string,
    courseId: string,
    courseWorkId: string,
    submissionId: string,
    grade: number
  ) => {
    try {
      const response = await axios.patch(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}?updateMask=assignedGrade`,
        { assignedGrade: grade },
        getHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, `gradeSubmission(${courseId}, ${courseWorkId}, ${submissionId})`);
    }
  },

  returnSubmission: async (token: string, courseId: string, courseWorkId: string, submissionId: string) => {
    try {
      return await axios.post(
        `${BASE_URL}/courses/${courseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}:return`,
        {},
        getHeaders(token)
      );
    } catch (error: any) {
      throw handleApiError(error, `returnSubmission(${courseId}, ${courseWorkId}, ${submissionId})`);
    }
  },

  // ==================== ANNOUNCEMENTS (TEACHER) ====================
  createAnnouncement: async (token: string, courseId: string, text: string): Promise<Announcement> => {
    try {
      const response = await axios.post(
        `${BASE_URL}/courses/${courseId}/announcements`,
        { text, state: 'PUBLISHED' },
        getHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, `createAnnouncement(${courseId})`);
    }
  },

  // ==================== INVITE TEACHER TO COURSE ====================
  inviteTeacher: async (token: string, courseId: string, email: string): Promise<any> => {
    try {
      const response = await axios.post(
        `${BASE_URL}/courses/${courseId}/teachers`,
        { userId: email },
        getHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, `inviteTeacher(${courseId}, ${email})`);
    }
  },

  // ==================== REMOVE TEACHER FROM COURSE ====================
  removeTeacher: async (token: string, courseId: string, userId: string): Promise<void> => {
    try {
      await axios.delete(
        `${BASE_URL}/courses/${courseId}/teachers/${userId}`,
        getHeaders(token)
      );
    } catch (error: any) {
      throw handleApiError(error, `removeTeacher(${courseId}, ${userId})`);
    }
  },

  // ==================== INVITE STUDENT TO COURSE ====================
  inviteStudent: async (token: string, courseId: string, email: string): Promise<any> => {
    try {
      const response = await axios.post(
        `${BASE_URL}/courses/${courseId}/students`,
        { userId: email },
        getHeaders(token)
      );
      return response.data;
    } catch (error: any) {
      throw handleApiError(error, `inviteStudent(${courseId}, ${email})`);
    }
  },

  // ==================== BULK INVITE ====================
  bulkInviteTeachers: async (token: string, courseId: string, emails: string[]): Promise<{ success: string[]; failed: { email: string; error: string }[] }> => {
    const results = { success: [] as string[], failed: [] as { email: string; error: string }[] };
    
    for (const email of emails) {
      try {
        await classroomService.inviteTeacher(token, courseId, email);
        results.success.push(email);
      } catch (error: any) {
        results.failed.push({ email, error: error.message });
      }
    }
    
    return results;
  },

  bulkInviteStudents: async (token: string, courseId: string, emails: string[]): Promise<{ success: string[]; failed: { email: string; error: string }[] }> => {
    const results = { success: [] as string[], failed: [] as { email: string; error: string }[] };
    
    for (const email of emails) {
      try {
        await classroomService.inviteStudent(token, courseId, email);
        results.success.push(email);
      } catch (error: any) {
        results.failed.push({ email, error: error.message });
      }
    }
    
    return results;
  },

  // ==================== JOIN COURSE (STUDENT) ====================
  joinCourse: async (token: string, enrollmentCode: string): Promise<Course> => {
    try {
      // First, get courses to find the one with this enrollment code
      // Since we can't directly lookup by code, we add the student using the enrollment code
      // by passing userId=me and enrollmentCode in the body to an alias course id
      const response = await axios.post(
        `${BASE_URL}/courses/d:${enrollmentCode}/students`,
        { userId: 'me' },
        getHeaders(token)
      );
      // After joining, fetch the course details
      const courseId = response.data.courseId;
      return await classroomService.getCourse(token, courseId);
    } catch (error: any) {
      throw handleApiError(error, `joinCourse(${enrollmentCode})`);
    }
  },

  // ==================== STATS (ADMIN) ====================
  getStats: async (token: string) => {
    try {
      const courses = await classroomService.getCourses(token);
      let totalTeachers = 0;
      let totalStudents = 0;
      const teacherIds = new Set<string>();
      const studentIds = new Set<string>();

      for (const course of courses) {
        const teachers = await classroomService.getTeachers(token, course.id);
        const students = await classroomService.getStudents(token, course.id);
        teachers.forEach(t => teacherIds.add(t.userId));
        students.forEach(s => studentIds.add(s.userId));
      }

      return {
        totalCourses: courses.length,
        totalTeachers: teacherIds.size,
        totalStudents: studentIds.size,
        courses,
      };
    } catch (error: any) {
      throw handleApiError(error, 'getStats');
    }
  },
};
