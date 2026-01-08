import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { BookOpen, Loader2, ExternalLink, UserPlus, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BulkInviteDialog } from '@/components/classroom/BulkInviteDialog';

export default function AdminCoursesPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [teacherEmail, setTeacherEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkTeacherDialogOpen, setBulkTeacherDialogOpen] = useState(false);
  const [bulkStudentDialogOpen, setBulkStudentDialogOpen] = useState(false);
  const [bulkCourse, setBulkCourse] = useState<Course | null>(null);

  useEffect(() => {
    fetchCourses();
  }, [token]);

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

  const handleInviteTeacher = async () => {
    if (!token || !selectedCourse || !teacherEmail.trim()) return;
    setIsInviting(true);
    try {
      await classroomService.inviteTeacher(token, selectedCourse.id, teacherEmail.trim());
      toast.success(`Teacher invited to ${selectedCourse.name}`);
      setTeacherEmail('');
      setDialogOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to invite teacher');
    } finally {
      setIsInviting(false);
    }
  };

  const handleBulkInviteTeachers = async (emails: string[]) => {
    if (!token || !bulkCourse) return;
    const results = await classroomService.bulkInviteTeachers(token, bulkCourse.id, emails);
    if (results.success.length > 0) {
      toast.success(`Successfully invited ${results.success.length} teacher(s)`);
    }
    if (results.failed.length > 0) {
      toast.error(`Failed to invite ${results.failed.length} teacher(s)`);
    }
    setBulkCourse(null);
  };

  const handleBulkInviteStudents = async (emails: string[]) => {
    if (!token || !bulkCourse) return;
    const results = await classroomService.bulkInviteStudents(token, bulkCourse.id, emails);
    if (results.success.length > 0) {
      toast.success(`Successfully invited ${results.success.length} student(s)`);
    }
    if (results.failed.length > 0) {
      toast.error(`Failed to invite ${results.failed.length} student(s)`);
    }
    setBulkCourse(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">All Courses</h1>
        <p className="text-muted-foreground">Manage all courses in your organization</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Courses ({courses.length})
            </CardTitle>
            <CardDescription>Complete list of courses in your domain</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell>{course.section || '-'}</TableCell>
                    <TableCell>{course.room || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={course.courseState === 'ACTIVE' ? 'default' : 'secondary'}>
                        {course.courseState}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/admin/course/${course.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Dialog open={dialogOpen && selectedCourse?.id === course.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) {
                            setSelectedCourse(null);
                            setTeacherEmail('');
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCourse(course)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Teacher
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Teacher to {course.name}</DialogTitle>
                              <DialogDescription>
                                Enter the teacher's email address to invite them as a co-teacher for this course.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="teacher-email">Teacher Email</Label>
                                <Input
                                  id="teacher-email"
                                  type="email"
                                  placeholder="teacher@school.edu"
                                  value={teacherEmail}
                                  onChange={(e) => setTeacherEmail(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button 
                                variant="secondary" 
                                onClick={() => {
                                  setDialogOpen(false);
                                  setBulkCourse(course);
                                  setBulkTeacherDialogOpen(true);
                                }}
                              >
                                <Users className="h-4 w-4 mr-1" />
                                Bulk Invite
                              </Button>
                              <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button 
                                  onClick={handleInviteTeacher} 
                                  disabled={isInviting || !teacherEmail.trim()}
                                >
                                  {isInviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                  Invite
                                </Button>
                              </div>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setBulkCourse(course);
                            setBulkStudentDialogOpen(true);
                          }}
                        >
                          <Users className="h-4 w-4 mr-1" />
                          Students
                        </Button>
                        {course.alternateLink && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={course.alternateLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {courses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No courses found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Bulk Invite Dialogs */}
      <BulkInviteDialog
        open={bulkTeacherDialogOpen}
        onOpenChange={setBulkTeacherDialogOpen}
        onInvite={handleBulkInviteTeachers}
        type="teacher"
        courseName={bulkCourse?.name}
      />
      <BulkInviteDialog
        open={bulkStudentDialogOpen}
        onOpenChange={setBulkStudentDialogOpen}
        onInvite={handleBulkInviteStudents}
        type="student"
        courseName={bulkCourse?.name}
      />
    </div>
  );
}
