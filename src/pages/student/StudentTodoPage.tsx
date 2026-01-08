import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, CourseWork, StudentSubmission } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Clock, Loader2, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface AssignmentWithCourse extends CourseWork {
  courseName: string;
  courseId: string;
}

export default function StudentTodoPage() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<AssignmentWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTodoAssignments();
  }, [token]);

  const fetchTodoAssignments = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const courses = await classroomService.getCourses(token);
      const allAssignments: AssignmentWithCourse[] = [];

      for (const course of courses) {
        const courseWork = await classroomService.getCourseWork(token, course.id);
        for (const work of courseWork) {
          const submission = await classroomService.getSubmission(token, course.id, work.id);
          // Only include if not turned in or returned
          if (!submission || (submission.state !== 'TURNED_IN' && submission.state !== 'RETURNED')) {
            allAssignments.push({
              ...work,
              courseName: course.name,
              courseId: course.id,
            });
          }
        }
      }

      // Sort by due date
      allAssignments.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        const dateA = new Date(a.dueDate.year, a.dueDate.month - 1, a.dueDate.day);
        const dateB = new Date(b.dueDate.year, b.dueDate.month - 1, b.dueDate.day);
        return dateA.getTime() - dateB.getTime();
      });

      setAssignments(allAssignments);
    } catch (error) {
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDueDate = (dueDate?: { year: number; month: number; day: number }) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate.year, dueDate.month - 1, dueDate.day);
    return format(date, 'MMM d, yyyy');
  };

  const isOverdue = (dueDate?: { year: number; month: number; day: number }) => {
    if (!dueDate) return false;
    const due = new Date(dueDate.year, dueDate.month - 1, dueDate.day);
    return new Date() > due;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">To Do</h1>
        <p className="text-muted-foreground">All your pending assignments</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground">All caught up! No pending assignments.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{assignment.title}</CardTitle>
                    <CardDescription>{assignment.courseName}</CardDescription>
                  </div>
                  {isOverdue(assignment.dueDate) ? (
                    <Badge variant="destructive">Missing</Badge>
                  ) : (
                    <Badge variant="secondary">Assigned</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {assignment.maxPoints && (
                    <span>{assignment.maxPoints} points</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Due: {formatDueDate(assignment.dueDate)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
