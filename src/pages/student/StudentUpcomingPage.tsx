import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, CourseWork } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, Loader2 } from 'lucide-react';
import { format, isAfter, addDays } from 'date-fns';

interface AssignmentWithCourse extends CourseWork {
  courseName: string;
  courseId: string;
}

export default function StudentUpcomingPage() {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<AssignmentWithCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingAssignments();
  }, [token]);

  const fetchUpcomingAssignments = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const courses = await classroomService.getCourses(token);
      const allAssignments: AssignmentWithCourse[] = [];
      const today = new Date();
      const nextWeek = addDays(today, 7);

      for (const course of courses) {
        const courseWork = await classroomService.getCourseWork(token, course.id);
        for (const work of courseWork) {
          if (work.dueDate) {
            const dueDate = new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day);
            // Include if due within next 7 days and not overdue
            if (isAfter(dueDate, today) && !isAfter(dueDate, nextWeek)) {
              allAssignments.push({
                ...work,
                courseName: course.name,
                courseId: course.id,
              });
            }
          }
        }
      }

      // Sort by due date
      allAssignments.sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        const dateA = new Date(a.dueDate.year, a.dueDate.month - 1, a.dueDate.day);
        const dateB = new Date(b.dueDate.year, b.dueDate.month - 1, b.dueDate.day);
        return dateA.getTime() - dateB.getTime();
      });

      setAssignments(allAssignments);
    } catch (error) {
      toast.error('Failed to load upcoming assignments');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDueDate = (dueDate: { year: number; month: number; day: number }) => {
    const date = new Date(dueDate.year, dueDate.month - 1, dueDate.day);
    return format(date, 'EEEE, MMM d');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Upcoming</h1>
        <p className="text-muted-foreground">Assignments due in the next 7 days</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : assignments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No upcoming assignments in the next 7 days</p>
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
                  <Badge variant="outline" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    {assignment.dueDate && formatDueDate(assignment.dueDate)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {assignment.maxPoints && (
                  <p className="text-sm text-muted-foreground">{assignment.maxPoints} points</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
