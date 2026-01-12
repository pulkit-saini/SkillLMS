import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, CourseWork } from '@/services/classroomService';
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
  Users,
  ClipboardList,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

interface TeacherCoursePerformance {
  courseId: string;
  courseName: string;
  studentCount: number;
  assignmentCount: number;
  submissionRate: number;
  lateRate: number;
}

interface TeacherDetails {
  userId: string;
  name: string;
  email?: string;
  photoUrl?: string;
  totalCourses: number;
  totalStudents: number;
  totalAssignments: number;
  averageSubmissionRate: number;
  averageLateRate: number;
  coursePerformance: TeacherCoursePerformance[];
}

export default function AdminTeacherDetailPage() {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token && teacherId) {
      fetchTeacherDetails();
    }
  }, [token, teacherId]);

  const fetchTeacherDetails = async () => {
    if (!token || !teacherId) return;
    setIsLoading(true);

    try {
      const allCourses = await classroomService.getCourses(token);
      const activeCourses = allCourses.filter(c => c.courseState === 'ACTIVE');

      let teacherProfile: { name: string; email?: string; photoUrl?: string } | null = null;
      const coursePerformance: TeacherCoursePerformance[] = [];

      for (const course of activeCourses) {
        try {
          const teachers = await classroomService.getTeachers(token, course.id);
          const teacherInCourse = teachers.find(t => t.userId === teacherId);

          if (!teacherInCourse) continue;

          if (!teacherProfile && teacherInCourse.profile) {
            teacherProfile = {
              name: teacherInCourse.profile.name?.fullName || 'Unknown Teacher',
              email: teacherInCourse.profile.emailAddress,
              photoUrl: teacherInCourse.profile.photoUrl,
            };
          }

          const [students, courseWork] = await Promise.all([
            classroomService.getStudents(token, course.id).catch(() => []),
            classroomService.getCourseWork(token, course.id).catch(() => [])
          ]);

          let submittedCount = 0;
          let lateCount = 0;
          let totalPossible = 0;

          for (const work of courseWork) {
            try {
              const submissions = await classroomService.getAllStudentSubmissions(token, course.id, work.id);
              totalPossible += students.length;
              
              submissions.forEach(sub => {
                if (sub.state === 'TURNED_IN' || sub.state === 'RETURNED') {
                  submittedCount++;
                  if (sub.late) lateCount++;
                }
              });
            } catch (error) {
              console.warn(`Failed to get submissions for work ${work.id}:`, error);
            }
          }

          const submissionRate = totalPossible > 0 ? Math.round((submittedCount / totalPossible) * 100) : 0;
          const lateRate = submittedCount > 0 ? Math.round((lateCount / submittedCount) * 100) : 0;

          coursePerformance.push({
            courseId: course.id,
            courseName: course.name,
            studentCount: students.length,
            assignmentCount: courseWork.length,
            submissionRate,
            lateRate,
          });
        } catch (error) {
          console.warn(`Failed to process course ${course.id}:`, error);
        }
      }

      if (!teacherProfile) {
        toast.error('Teacher not found in any courses');
        navigate('/admin/teachers');
        return;
      }

      const totalCourses = coursePerformance.length;
      const totalStudents = coursePerformance.reduce((sum, c) => sum + c.studentCount, 0);
      const totalAssignments = coursePerformance.reduce((sum, c) => sum + c.assignmentCount, 0);
      const averageSubmissionRate = totalCourses > 0 
        ? Math.round(coursePerformance.reduce((sum, c) => sum + c.submissionRate, 0) / totalCourses) 
        : 0;
      const averageLateRate = totalCourses > 0
        ? Math.round(coursePerformance.reduce((sum, c) => sum + c.lateRate, 0) / totalCourses)
        : 0;

      setTeacher({
        userId: teacherId,
        name: teacherProfile.name,
        email: teacherProfile.email,
        photoUrl: teacherProfile.photoUrl,
        totalCourses,
        totalStudents,
        totalAssignments,
        averageSubmissionRate,
        averageLateRate,
        coursePerformance,
      });
    } catch (error) {
      console.error('Failed to fetch teacher details:', error);
      toast.error('Failed to load teacher details');
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

  const getPerformanceStatus = (rate: number) => {
    if (rate >= 80) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-500/10' };
    if (rate >= 60) return { label: 'Good', color: 'text-yellow-600', bg: 'bg-yellow-500/10' };
    return { label: 'Needs Support', color: 'text-destructive', bg: 'bg-destructive/10' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading teacher details...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate('/admin/teachers')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Teachers
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <User className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Teacher Not Found</h3>
            <p className="text-muted-foreground">Could not find teacher data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = getPerformanceStatus(teacher.averageSubmissionRate);

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/admin/teachers')} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Teachers
      </Button>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={teacher.photoUrl} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {getInitials(teacher.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{teacher.name}</h1>
                {teacher.email && (
                  <p className="text-muted-foreground flex items-center gap-1 mt-1">
                    <Mail className="h-4 w-4" />
                    {teacher.email}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${status.bg} ${status.color}`}>
                    {status.label}
                  </Badge>
                  <Badge variant="outline">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {teacher.totalCourses} Courses
                  </Badge>
                </div>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden md:block h-24" />

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary/5">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold text-primary">{teacher.averageSubmissionRate}%</p>
                <p className="text-xs text-muted-foreground">Avg Submission Rate</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/5">
                <Users className="h-5 w-5 mx-auto mb-1 text-accent" />
                <p className="text-2xl font-bold text-accent">{teacher.totalStudents}</p>
                <p className="text-xs text-muted-foreground">Total Students</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-green-500/5">
                <ClipboardList className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <p className="text-2xl font-bold text-green-600">{teacher.totalAssignments}</p>
                <p className="text-xs text-muted-foreground">Assignments</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-yellow-500/5">
                <Clock className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-600">{teacher.averageLateRate}%</p>
                <p className="text-xs text-muted-foreground">Avg Late Rate</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Courses Overview
        </h2>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            {teacher.coursePerformance.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No courses found</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead className="text-center">Students</TableHead>
                      <TableHead className="text-center">Assignments</TableHead>
                      <TableHead>Submission Rate</TableHead>
                      <TableHead className="text-center">Late Rate</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacher.coursePerformance.map((course) => {
                      const courseStatus = getPerformanceStatus(course.submissionRate);
                      return (
                        <TableRow 
                          key={course.courseId}
                          className="cursor-pointer hover:bg-secondary/50"
                          onClick={() => navigate(`/admin/course/${course.courseId}`)}
                        >
                          <TableCell className="font-medium">{course.courseName}</TableCell>
                          <TableCell className="text-center">{course.studentCount}</TableCell>
                          <TableCell className="text-center">{course.assignmentCount}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Progress value={course.submissionRate} className="flex-1 h-2" />
                              <span className="text-sm font-medium w-10">{course.submissionRate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className={course.lateRate <= 10 ? 'text-green-600' : course.lateRate <= 25 ? 'text-yellow-600' : 'text-destructive'}>
                              {course.lateRate}%
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${courseStatus.bg} ${courseStatus.color}`}>
                              {courseStatus.label}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
