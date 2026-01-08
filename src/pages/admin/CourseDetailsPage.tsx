import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, CourseWork, Teacher, Student, Announcement, StudentSubmission } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Loader2, 
  BookOpen, 
  Users, 
  MessageSquare, 
  GraduationCap,
  FileText,
  Calendar,
  ExternalLink,
  UserMinus
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CourseDetailsPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [courseWork, setCourseWork] = useState<CourseWork[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [grades, setGrades] = useState<Map<string, StudentSubmission[]>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stream');
  const [teacherToRemove, setTeacherToRemove] = useState<Teacher | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (token && courseId) {
      fetchCourseData();
    }
  }, [token, courseId]);

  const fetchCourseData = async () => {
    if (!token || !courseId) return;
    setIsLoading(true);
    try {
      const [courseData, workData, teacherData, studentData, announcementData] = await Promise.all([
        classroomService.getCourse(token, courseId),
        classroomService.getCourseWork(token, courseId).catch(() => []),
        classroomService.getTeachers(token, courseId).catch(() => []),
        classroomService.getStudents(token, courseId).catch(() => []),
        classroomService.getAnnouncements(token, courseId).catch(() => []),
      ]);
      
      setCourse(courseData);
      setCourseWork(workData);
      setTeachers(teacherData);
      setStudents(studentData);
      setAnnouncements(announcementData);

      // Fetch grades for each coursework
      const gradesMap = new Map<string, StudentSubmission[]>();
      for (const work of workData) {
        const submissions = await classroomService.getAllStudentSubmissions(token, courseId, work.id).catch(() => []);
        gradesMap.set(work.id, submissions);
      }
      setGrades(gradesMap);
    } catch (error) {
      toast.error('Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveTeacher = async () => {
    if (!token || !courseId || !teacherToRemove) return;
    setIsRemoving(true);
    try {
      await classroomService.removeTeacher(token, courseId, teacherToRemove.userId);
      toast.success('Teacher removed from course');
      setTeachers(teachers.filter(t => t.userId !== teacherToRemove.userId));
      setTeacherToRemove(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove teacher');
    } finally {
      setIsRemoving(false);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDueDate = (dueDate?: { year: number; month: number; day: number }) => {
    if (!dueDate) return 'No due date';
    return new Date(dueDate.year, dueDate.month - 1, dueDate.day).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button variant="link" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{course.name}</h1>
          <p className="text-muted-foreground">
            {course.section && `Section: ${course.section}`}
            {course.room && ` • Room: ${course.room}`}
          </p>
        </div>
        <Badge variant={course.courseState === 'ACTIVE' ? 'default' : 'secondary'}>
          {course.courseState}
        </Badge>
        {course.alternateLink && (
          <Button variant="outline" asChild>
            <a href={course.alternateLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Classroom
            </a>
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="stream" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Stream
          </TabsTrigger>
          <TabsTrigger value="classwork" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Classwork
          </TabsTrigger>
          <TabsTrigger value="people" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            People
          </TabsTrigger>
          <TabsTrigger value="grades" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Grades
          </TabsTrigger>
        </TabsList>

        {/* Stream Tab */}
        <TabsContent value="stream" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Announcements ({announcements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No announcements yet</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="p-4 border rounded-lg">
                      <p className="text-foreground whitespace-pre-wrap">{announcement.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Posted {formatDate(announcement.creationTime)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classwork Tab */}
        <TabsContent value="classwork" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assignments ({courseWork.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {courseWork.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No assignments yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseWork.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell className="font-medium">{work.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{work.workType || 'Assignment'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {formatDueDate(work.dueDate)}
                          </div>
                        </TableCell>
                        <TableCell>{work.maxPoints || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={work.state === 'PUBLISHED' ? 'default' : 'secondary'}>
                            {work.state}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* People Tab */}
        <TabsContent value="people" className="space-y-4">
          {/* Teachers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Teachers ({teachers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {teachers.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No teachers assigned</p>
              ) : (
                <div className="space-y-3">
                  {teachers.map((teacher) => (
                    <div key={teacher.userId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={teacher.profile?.photoUrl} />
                          <AvatarFallback>
                            {teacher.profile?.name?.givenName?.[0]}
                            {teacher.profile?.name?.familyName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{teacher.profile?.name?.fullName || 'Unknown'}</p>
                          <p className="text-sm text-muted-foreground">{teacher.profile?.emailAddress}</p>
                        </div>
                      </div>
                      {teachers.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setTeacherToRemove(teacher)}
                        >
                          <UserMinus className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Students ({students.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No students enrolled</p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {students.map((student) => (
                    <div key={student.userId} className="flex items-center gap-3 p-3 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={student.profile?.photoUrl} />
                        <AvatarFallback>
                          {student.profile?.name?.givenName?.[0]}
                          {student.profile?.name?.familyName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{student.profile?.name?.fullName || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground truncate">{student.profile?.emailAddress}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Grades Overview
              </CardTitle>
              <CardDescription>View submission status and grades for all assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {courseWork.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No assignments to grade</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Max Points</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Graded</TableHead>
                      <TableHead>Avg Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseWork.map((work) => {
                      const submissions = grades.get(work.id) || [];
                      const submitted = submissions.filter(s => s.state === 'TURNED_IN' || s.state === 'RETURNED').length;
                      const graded = submissions.filter(s => s.assignedGrade !== undefined).length;
                      const avgGrade = graded > 0 
                        ? (submissions.reduce((sum, s) => sum + (s.assignedGrade || 0), 0) / graded).toFixed(1)
                        : '-';
                      
                      return (
                        <TableRow key={work.id}>
                          <TableCell className="font-medium">{work.title}</TableCell>
                          <TableCell>{work.maxPoints || '-'}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{submitted} / {students.length}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={graded === students.length ? 'default' : 'secondary'}>
                              {graded} / {students.length}
                            </Badge>
                          </TableCell>
                          <TableCell>{avgGrade}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Remove Teacher Confirmation Dialog */}
      <AlertDialog open={!!teacherToRemove} onOpenChange={() => setTeacherToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {teacherToRemove?.profile?.name?.fullName || 'this teacher'} from {course.name}? 
              They will no longer have access to this course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemoveTeacher}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isRemoving}
            >
              {isRemoving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Remove Teacher
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
