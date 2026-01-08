import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { classroomService, Course, CourseWork, StudentSubmission } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  Plus, 
  ExternalLink, 
  Calendar,
  GraduationCap,
  Loader2,
  RefreshCw
} from 'lucide-react';
import TeacherClassesPage from './TeacherClassesPage';
import TeacherReviewPage from './TeacherReviewPage';
import TeacherCreateClassPage from './TeacherCreateClassPage';

function TeacherOverviewPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseWork, setCourseWork] = useState<CourseWork[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, StudentSubmission[]>>({});
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [createAssignmentOpen, setCreateAssignmentOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', maxPoints: 100, dueDate: '' });

  useEffect(() => { fetchCourses(); }, [token]);
  useEffect(() => { if (selectedCourse) fetchCourseDetails(); }, [selectedCourse]);

  const fetchCourses = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await classroomService.getCourses(token);
      const teacherCourses = [];
      for (const course of data) {
        const role = await classroomService.getUserRoleInCourse(token, course.id);
        if (role === 'teacher') teacherCourses.push(course);
      }
      setCourses(teacherCourses);
    } catch { toast.error('Failed to load courses'); }
    finally { setIsLoading(false); }
  };

  const fetchCourseDetails = async () => {
    if (!token || !selectedCourse) return;
    try {
      const [work, studentList] = await Promise.all([
        classroomService.getCourseWork(token, selectedCourse.id),
        classroomService.getStudents(token, selectedCourse.id)
      ]);
      setCourseWork(work);
      setStudents(studentList);
      const submissionsMap: Record<string, StudentSubmission[]> = {};
      for (const w of work) {
        submissionsMap[w.id] = await classroomService.getAllStudentSubmissions(token, selectedCourse.id, w.id);
      }
      setSubmissions(submissionsMap);
    } catch { toast.error('Failed to load course details'); }
  };

  const handleCreateAssignment = async () => {
    if (!token || !selectedCourse || !newAssignment.title) return;
    setIsCreatingAssignment(true);
    try {
      const dueDate = newAssignment.dueDate ? {
        year: new Date(newAssignment.dueDate).getFullYear(),
        month: new Date(newAssignment.dueDate).getMonth() + 1,
        day: new Date(newAssignment.dueDate).getDate()
      } : undefined;
      await classroomService.createCourseWork(token, selectedCourse.id, {
        title: newAssignment.title, description: newAssignment.description,
        workType: 'ASSIGNMENT', maxPoints: newAssignment.maxPoints, dueDate
      });
      toast.success('Assignment created!');
      setCreateAssignmentOpen(false);
      setNewAssignment({ title: '', description: '', maxPoints: 100, dueDate: '' });
      fetchCourseDetails();
    } catch (error: any) { toast.error(error.message || 'Failed to create assignment'); }
    finally { setIsCreatingAssignment(false); }
  };

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div><h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1><p className="text-muted-foreground">Manage your classes and assignments</p></div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 ? (
            <Card className="col-span-full"><CardContent className="flex flex-col items-center justify-center py-12"><BookOpen className="h-12 w-12 text-muted-foreground mb-4" /><p className="text-muted-foreground">No classes yet</p></CardContent></Card>
          ) : courses.map((course) => (
            <Card key={course.id} className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50" onClick={() => setSelectedCourse(course)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center"><BookOpen className="h-5 w-5 text-primary-foreground" /></div>
                  <Badge variant="outline">{course.courseState}</Badge>
                </div>
                <CardTitle className="mt-3">{course.name}</CardTitle>
                <CardDescription>{course.section}{course.room && ` • ${course.room}`}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setSelectedCourse(null)}>← Back</Button>
        <div className="flex-1"><h2 className="text-2xl font-bold">{selectedCourse.name}</h2><p className="text-muted-foreground">{selectedCourse.section}</p></div>
        <Button variant="outline" onClick={fetchCourseDetails}><RefreshCw className="h-4 w-4 mr-2" />Refresh</Button>
        {selectedCourse.alternateLink && <Button variant="outline" asChild><a href={selectedCourse.alternateLink} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4 mr-2" />Open</a></Button>}
      </div>
      <Tabs defaultValue="classwork">
        <TabsList><TabsTrigger value="classwork">Classwork</TabsTrigger><TabsTrigger value="people">People</TabsTrigger></TabsList>
        <TabsContent value="classwork" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Dialog open={createAssignmentOpen} onOpenChange={setCreateAssignmentOpen}>
              <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Create Assignment</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Assignment</DialogTitle></DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2"><Label>Title *</Label><Input value={newAssignment.title} onChange={(e) => setNewAssignment(p => ({ ...p, title: e.target.value }))} /></div>
                  <div className="space-y-2"><Label>Instructions</Label><Textarea value={newAssignment.description} onChange={(e) => setNewAssignment(p => ({ ...p, description: e.target.value }))} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Points</Label><Input type="number" value={newAssignment.maxPoints} onChange={(e) => setNewAssignment(p => ({ ...p, maxPoints: parseInt(e.target.value) || 100 }))} /></div>
                    <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={newAssignment.dueDate} onChange={(e) => setNewAssignment(p => ({ ...p, dueDate: e.target.value }))} /></div>
                  </div>
                  <Button onClick={handleCreateAssignment} disabled={isCreatingAssignment || !newAssignment.title} className="w-full">{isCreatingAssignment && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {courseWork.length === 0 ? <Card><CardContent className="py-12 text-center text-muted-foreground">No assignments yet</CardContent></Card> : courseWork.map((work) => (
            <Card key={work.id}><CardHeader><div className="flex items-start justify-between"><div><CardTitle className="text-lg">{work.title}</CardTitle><CardDescription>{work.description}</CardDescription></div><div className="flex items-center gap-2">{work.maxPoints && <Badge variant="secondary">{work.maxPoints} pts</Badge>}{work.dueDate && <Badge variant="outline">{work.dueDate.month}/{work.dueDate.day}</Badge>}</div></div></CardHeader></Card>
          ))}
        </TabsContent>
        <TabsContent value="people" className="mt-4">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Students ({students.length})</CardTitle></CardHeader><CardContent><div className="space-y-2">{students.map((s) => <div key={s.odUserId} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50"><GraduationCap className="h-4 w-4" /><span>{s.profile?.name?.fullName || s.userId}</span></div>)}</div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function TeacherDashboard() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  return (
    <DashboardLayout allowedRoles={['teacher']}>
      <Routes>
        <Route index element={<TeacherOverviewPage />} />
        <Route path="classes" element={<TeacherClassesPage onSelectCourse={setSelectedCourse} />} />
        <Route path="review" element={<TeacherReviewPage />} />
        <Route path="create-class" element={<TeacherCreateClassPage />} />
      </Routes>
    </DashboardLayout>
  );
}
