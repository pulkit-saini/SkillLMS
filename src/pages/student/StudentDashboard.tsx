import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { classroomService, Course, CourseWork, StudentSubmission } from '@/services/classroomService';
import { DriveFile } from '@/services/driveService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/classroom/FileUpload';
import { toast } from 'sonner';
import { 
  BookOpen, 
  ExternalLink, 
  Calendar,
  Loader2,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Link as LinkIcon,
  Send,
  Undo,
  Upload,
  Paperclip,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';
import StudentClassesPage from './StudentClassesPage';
import StudentTodoPage from './StudentTodoPage';
import StudentUpcomingPage from './StudentUpcomingPage';

interface AssignmentWithSubmission extends CourseWork {
  submission?: StudentSubmission;
}

type AttachmentType = 'link' | 'file';

function StudentOverviewPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<AssignmentWithSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentWithSubmission | null>(null);
  const [attachmentType, setAttachmentType] = useState<AttachmentType>('file');
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [enrollmentCode, setEnrollmentCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [token]);

  useEffect(() => {
    if (selectedCourse) {
      fetchAssignments();
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await classroomService.getCourses(token);
      setCourses(data);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignments = async () => {
    if (!token || !selectedCourse) return;
    try {
      const courseWork = await classroomService.getCourseWork(token, selectedCourse.id);
      
      const assignmentsWithSubmissions: AssignmentWithSubmission[] = await Promise.all(
        courseWork.map(async (work) => {
          const submission = await classroomService.getSubmission(token, selectedCourse.id, work.id);
          return { ...work, submission: submission || undefined };
        })
      );
      
      setAssignments(assignmentsWithSubmissions);
    } catch (error) {
      toast.error('Failed to load assignments');
    }
  };

  const getStatusBadge = (assignment: AssignmentWithSubmission) => {
    const submission = assignment.submission;
    if (!submission) {
      return <Badge variant="secondary">Assigned</Badge>;
    }

    switch (submission.state) {
      case 'TURNED_IN':
        return <Badge className="bg-primary">Turned In</Badge>;
      case 'RETURNED':
        return <Badge className="bg-accent">Graded</Badge>;
      case 'RECLAIMED_BY_STUDENT':
        return <Badge variant="outline">Reclaimed</Badge>;
      default:
        if (submission.late) {
          return <Badge variant="destructive">Late</Badge>;
        }
        if (assignment.dueDate) {
          const due = new Date(assignment.dueDate.year, assignment.dueDate.month - 1, assignment.dueDate.day);
          if (new Date() > due) {
            return <Badge variant="destructive">Missing</Badge>;
          }
        }
        return <Badge variant="secondary">Assigned</Badge>;
    }
  };

  const handleAddLink = async () => {
    if (!token || !selectedCourse || !selectedAssignment?.submission || !linkUrl) return;
    setIsSubmitting(true);
    try {
      await classroomService.addLink(
        token, 
        selectedCourse.id, 
        selectedAssignment.id, 
        selectedAssignment.submission.id, 
        linkUrl
      );
      toast.success('Link attached!');
      setAttachDialogOpen(false);
      setLinkUrl('');
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to attach link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUploaded = async (driveFile: DriveFile) => {
    if (!token || !selectedCourse || !selectedAssignment?.submission) return;
    try {
      await classroomService.addDriveFile(
        token,
        selectedCourse.id,
        selectedAssignment.id,
        selectedAssignment.submission.id,
        driveFile.id
      );
      toast.success('File attached to submission!');
      setAttachDialogOpen(false);
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to attach file');
    }
  };

  const handleTurnIn = async (assignment: AssignmentWithSubmission) => {
    if (!token || !selectedCourse || !assignment.submission) return;
    try {
      await classroomService.turnIn(token, selectedCourse.id, assignment.id, assignment.submission.id);
      toast.success('Assignment turned in!');
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to turn in');
    }
  };

  const handleUnsubmit = async (assignment: AssignmentWithSubmission) => {
    if (!token || !selectedCourse || !assignment.submission) return;
    try {
      await classroomService.reclaim(token, selectedCourse.id, assignment.id, assignment.submission.id);
      toast.success('Assignment unsubmitted');
      fetchAssignments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to unsubmit');
    }
  };

  const formatDueDate = (dueDate?: { year: number; month: number; day: number }) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate.year, dueDate.month - 1, dueDate.day);
    return format(date, 'MMM d, yyyy');
  };

  const handleJoinClass = async () => {
    if (!token || !enrollmentCode.trim()) return;
    setIsJoining(true);
    try {
      await classroomService.joinCourse(token, enrollmentCode.trim());
      toast.success('Successfully joined the class!');
      setJoinDialogOpen(false);
      setEnrollmentCode('');
      fetchCourses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to join class. Please check the code and try again.');
    } finally {
      setIsJoining(false);
    }
  };

  const todoAssignments = assignments.filter(a => 
    !a.submission || (a.submission.state !== 'TURNED_IN' && a.submission.state !== 'RETURNED')
  );

  const completedAssignments = assignments.filter(a => 
    a.submission && (a.submission.state === 'TURNED_IN' || a.submission.state === 'RETURNED')
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
          <p className="text-muted-foreground">View your classes and assignments</p>
        </div>
        <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Join Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Join a Class</DialogTitle>
              <DialogDescription>
                Enter the class code provided by your teacher to join the class.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="enrollment-code">Class Code</Label>
                <Input
                  id="enrollment-code"
                  placeholder="Enter class code"
                  value={enrollmentCode}
                  onChange={(e) => setEnrollmentCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleJoinClass()}
                />
              </div>
              <Button 
                onClick={handleJoinClass} 
                disabled={isJoining || !enrollmentCode.trim()} 
                className="w-full"
              >
                {isJoining && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Join Class
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Classes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No classes enrolled</p>
                </CardContent>
              </Card>
            ) : (
              courses.map((course) => (
                <Card 
                  key={course.id} 
                  className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                  onClick={() => setSelectedCourse(course)}
                >
                  <CardHeader>
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
                      <BookOpen className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>
                      {course.section && <span>{course.section}</span>}
                      {course.room && <span> • {course.room}</span>}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setSelectedCourse(null)}>
          ← Back to Classes
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{selectedCourse.name}</h2>
          <p className="text-muted-foreground">{selectedCourse.section}</p>
        </div>
        <Button variant="outline" onClick={fetchAssignments}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        {selectedCourse.alternateLink && (
          <Button variant="outline" asChild>
            <a href={selectedCourse.alternateLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Classroom
            </a>
          </Button>
        )}
      </div>

      <Tabs defaultValue="todo">
        <TabsList>
          <TabsTrigger value="todo" className="gap-2">
            <Clock className="h-4 w-4" />
            To Do ({todoAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="done" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Done ({completedAssignments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todo" className="space-y-4 mt-4">
          {todoAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <p className="text-muted-foreground">All caught up!</p>
              </CardContent>
            </Card>
          ) : (
            todoAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>{assignment.description}</CardDescription>
                    </div>
                    {getStatusBadge(assignment)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {assignment.maxPoints && (
                        <span>{assignment.maxPoints} points</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {formatDueDate(assignment.dueDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={attachDialogOpen && selectedAssignment?.id === assignment.id} onOpenChange={(open) => {
                        setAttachDialogOpen(open);
                        if (open) {
                          setSelectedAssignment(assignment);
                          setAttachmentType('file');
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={!assignment.submission}>
                            <Paperclip className="h-4 w-4 mr-2" />
                            Attach
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Attachment</DialogTitle>
                            <DialogDescription>
                              Upload a file or add a link to your submission
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex gap-2">
                              <Button
                                variant={attachmentType === 'file' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setAttachmentType('file')}
                                className="flex-1"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Upload File
                              </Button>
                              <Button
                                variant={attachmentType === 'link' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setAttachmentType('link')}
                                className="flex-1"
                              >
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Add Link
                              </Button>
                            </div>

                            {attachmentType === 'file' && token && (
                              <FileUpload
                                token={token}
                                onFileUploaded={handleFileUploaded}
                                maxSizeMB={25}
                              />
                            )}

                            {attachmentType === 'link' && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="url">URL</Label>
                                  <Input 
                                    id="url" 
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://..."
                                  />
                                </div>
                                <Button 
                                  onClick={handleAddLink} 
                                  disabled={isSubmitting || !linkUrl} 
                                  className="w-full"
                                >
                                  {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                  Attach Link
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        size="sm"
                        onClick={() => handleTurnIn(assignment)}
                        disabled={!assignment.submission || assignment.submission.state === 'TURNED_IN'}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Turn In
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="done" className="space-y-4 mt-4">
          {completedAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed assignments yet</p>
              </CardContent>
            </Card>
          ) : (
            completedAssignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription>{assignment.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(assignment)}
                      {assignment.submission?.assignedGrade !== undefined && (
                        <Badge variant="outline">
                          {assignment.submission.assignedGrade}/{assignment.maxPoints}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due: {formatDueDate(assignment.dueDate)}
                      </span>
                    </div>
                    {assignment.submission?.state === 'TURNED_IN' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUnsubmit(assignment)}
                      >
                        <Undo className="h-4 w-4 mr-2" />
                        Unsubmit
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function StudentDashboard() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  return (
    <DashboardLayout allowedRoles={['student']}>
      <Routes>
        <Route index element={<StudentOverviewPage />} />
        <Route path="classes" element={<StudentClassesPage onSelectCourse={setSelectedCourse} />} />
        <Route path="todo" element={<StudentTodoPage />} />
        <Route path="upcoming" element={<StudentUpcomingPage />} />
      </Routes>
    </DashboardLayout>
  );
}
