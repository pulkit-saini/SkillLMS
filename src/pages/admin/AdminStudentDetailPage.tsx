import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, CourseWork, StudentSubmission } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Loader2, 
  User, 
  Mail, 
  BookOpen, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface StudentCoursePerformance {
  courseId: string;
  courseName: string;
  totalAssignments: number;
  submittedCount: number;
  lateCount: number;
  missingCount: number;
  submissionRate: number;
  assignments: {
    id: string;
    title: string;
    dueDate?: string;
    maxPoints?: number;
    state: string;
    late: boolean;
    grade?: number;
  }[];
}

interface StudentDetails {
  userId: string;
  name: string;
  email?: string;
  photoUrl?: string;
  overallSubmissionRate: number;
  totalCourses: number;
  totalAssignments: number;
  totalSubmitted: number;
  totalLate: number;
  totalMissing: number;
  coursePerformance: StudentCoursePerformance[];
}

export default function AdminStudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token && studentId) {
      fetchStudentDetails();
    }
  }, [token, studentId]);

  const fetchStudentDetails = async () => {
    if (!token || !studentId) return;
    setIsLoading(true);

    try {
      // Get all courses
      const allCourses = await classroomService.getCourses(token);
      const activeCourses = allCourses.filter(c => c.courseState === 'ACTIVE');

      let studentProfile: { name: string; email?: string; photoUrl?: string } | null = null;
      const coursePerformance: StudentCoursePerformance[] = [];

      for (const course of activeCourses) {
        try {
          // Check if student is enrolled in this course
          const students = await classroomService.getStudents(token, course.id);
          const studentInCourse = students.find(s => s.userId === studentId);

          if (!studentInCourse) continue;

          // Get student profile info
          if (!studentProfile && studentInCourse.profile) {
            studentProfile = {
              name: studentInCourse.profile.name?.fullName || 'Unknown Student',
              email: studentInCourse.profile.emailAddress,
              photoUrl: studentInCourse.profile.photoUrl,
            };
          }

          // Get coursework and submissions
          const courseWork = await classroomService.getCourseWork(token, course.id).catch(() => []);
          const assignments: StudentCoursePerformance['assignments'] = [];
          let submittedCount = 0;
          let lateCount = 0;

          for (const work of courseWork) {
            try {
              const submissions = await classroomService.getAllStudentSubmissions(token, course.id, work.id);
              const studentSub = submissions.find(s => s.userId === studentId);

              let state = 'NOT_SUBMITTED';
              let late = false;
              let grade: number | undefined;

              if (studentSub) {
                state = studentSub.state;
                late = studentSub.late || false;
                grade = studentSub.assignedGrade;

                if (state === 'TURNED_IN' || state === 'RETURNED') {
                  submittedCount++;
                  if (late) lateCount++;
                }
              }

              let dueDate: string | undefined;
              if (work.dueDate) {
                dueDate = format(
                  new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day),
                  'MMM d, yyyy'
                );
              }

              assignments.push({
                id: work.id,
                title: work.title,
                dueDate,
                maxPoints: work.maxPoints,
                state,
                late,
                grade,
              });
            } catch (error) {
              console.warn(`Failed to get submission for work ${work.id}:`, error);
            }
          }

          const missingCount = courseWork.length - submittedCount;
          const submissionRate = courseWork.length > 0 
            ? Math.round((submittedCount / courseWork.length) * 100) 
            : 0;

          coursePerformance.push({
            courseId: course.id,
            courseName: course.name,
            totalAssignments: courseWork.length,
            submittedCount,
            lateCount,
            missingCount,
            submissionRate,
            assignments,
          });
        } catch (error) {
          console.warn(`Failed to process course ${course.id}:`, error);
        }
      }

      if (!studentProfile) {
        toast.error('Student not found in any courses');
        navigate('/admin');
        return;
      }

      // Calculate totals
      const totalCourses = coursePerformance.length;
      const totalAssignments = coursePerformance.reduce((sum, c) => sum + c.totalAssignments, 0);
      const totalSubmitted = coursePerformance.reduce((sum, c) => sum + c.submittedCount, 0);
      const totalLate = coursePerformance.reduce((sum, c) => sum + c.lateCount, 0);
      const totalMissing = coursePerformance.reduce((sum, c) => sum + c.missingCount, 0);
      const overallSubmissionRate = totalAssignments > 0 
        ? Math.round((totalSubmitted / totalAssignments) * 100) 
        : 0;

      setStudent({
        userId: studentId,
        name: studentProfile.name,
        email: studentProfile.email,
        photoUrl: studentProfile.photoUrl,
        overallSubmissionRate,
        totalCourses,
        totalAssignments,
        totalSubmitted,
        totalLate,
        totalMissing,
        coursePerformance,
      });
    } catch (error) {
      console.error('Failed to fetch student details:', error);
      toast.error('Failed to load student details');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusBadge = (state: string, late: boolean) => {
    if (state === 'TURNED_IN' || state === 'RETURNED') {
      if (late) {
        return <Badge className="bg-yellow-500/20 text-yellow-700">Late</Badge>;
      }
      return <Badge className="bg-green-500/20 text-green-700">Submitted</Badge>;
    }
    if (state === 'RECLAIMED_BY_STUDENT') {
      return <Badge className="bg-blue-500/20 text-blue-700">Reclaimed</Badge>;
    }
    return <Badge className="bg-destructive/20 text-destructive">Missing</Badge>;
  };

  const getOverallStatus = (rate: number) => {
    if (rate >= 80) return { label: 'On Track', color: 'text-green-600', bg: 'bg-green-500/10' };
    if (rate >= 50) return { label: 'At Risk', color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
    return { label: 'Inactive', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Student Not Found</h3>
            <p className="text-muted-foreground">Could not find student data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getOverallStatus(student.overallSubmissionRate);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/admin')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>

      {/* Student Header Card */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Section */}
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={student.photoUrl} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(student.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{student.name}</h1>
                {student.email && (
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-4 w-4" />
                    {student.email}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${status.bg} ${status.color}`}>
                    {status.label}
                  </Badge>
                  <Badge variant="outline">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {student.totalCourses} Courses
                  </Badge>
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-24" />

            {/* Stats Section */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold text-primary">{student.overallSubmissionRate}%</p>
                <p className="text-xs text-muted-foreground">Submission Rate</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-500/5">
                <CheckCircle className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{student.totalSubmitted}</p>
                <p className="text-xs text-muted-foreground">Submitted</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-500/5">
                <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-600">{student.totalLate}</p>
                <p className="text-xs text-muted-foreground">Late</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-destructive/5">
                <XCircle className="h-5 w-5 mx-auto mb-1 text-destructive" />
                <p className="text-2xl font-bold text-destructive">{student.totalMissing}</p>
                <p className="text-xs text-muted-foreground">Missing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Performance Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Performance by Course
        </h2>

        {student.coursePerformance.map((course) => (
          <Card key={course.courseId} className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{course.courseName}</CardTitle>
                  <CardDescription>
                    {course.totalAssignments} assignments • {course.submittedCount} submitted
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Progress value={course.submissionRate} className="w-24 h-2" />
                    <span className="text-sm font-medium">{course.submissionRate}%</span>
                  </div>
                  {course.submissionRate >= 80 ? (
                    <Badge className="bg-green-500/20 text-green-700">Good</Badge>
                  ) : course.submissionRate >= 50 ? (
                    <Badge className="bg-yellow-500/20 text-yellow-700">At Risk</Badge>
                  ) : (
                    <Badge className="bg-destructive/20 text-destructive">Needs Help</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {course.assignments.length === 0 ? (
                <p className="text-muted-foreground text-sm">No assignments in this course</p>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Assignment</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due Date
                          </div>
                        </TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {course.assignments.map((assignment) => (
                        <TableRow key={assignment.id}>
                          <TableCell className="font-medium">{assignment.title}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {assignment.dueDate || '—'}
                          </TableCell>
                          <TableCell>{assignment.maxPoints || '—'}</TableCell>
                          <TableCell>
                            {assignment.grade !== undefined 
                              ? `${assignment.grade}/${assignment.maxPoints || '?'}`
                              : '—'
                            }
                          </TableCell>
                          <TableCell>{getStatusBadge(assignment.state, assignment.late)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
