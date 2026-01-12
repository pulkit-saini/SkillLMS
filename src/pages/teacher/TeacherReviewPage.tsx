import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, CourseWork, StudentSubmission } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ClipboardList, Loader2 } from 'lucide-react';

interface SubmissionWithDetails {
  submission: StudentSubmission;
  assignment: CourseWork;
  courseName: string;
  courseId: string;
}

export default function TeacherReviewPage() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubmissionsToReview();
  }, [token]);

  const fetchSubmissionsToReview = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const courses = await classroomService.getCourses(token);
      const allSubmissions: SubmissionWithDetails[] = [];

      for (const course of courses) {
        const role = await classroomService.getUserRoleInCourse(token, course.id);
        if (role !== 'teacher') continue;

        const courseWork = await classroomService.getCourseWork(token, course.id);
        for (const work of courseWork) {
          const subs = await classroomService.getAllStudentSubmissions(token, course.id, work.id);
          // Filter for turned in but not returned/graded
          const toReview = subs.filter(s => s.state === 'TURNED_IN');
          toReview.forEach(sub => {
            allSubmissions.push({
              submission: sub,
              assignment: work,
              courseName: course.name,
              courseId: course.id,
            });
          });
        }
      }

      setSubmissions(allSubmissions);
    } catch (error) {
      toast.error('Failed to load submissions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">To Review</h1>
        <p className="text-muted-foreground">Student submissions awaiting your review</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : submissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardList className="h-12 w-12 text-primary mb-4" />
            <p className="text-muted-foreground">All caught up! No submissions to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((item, idx) => (
            <Card key={`${item.submission.id}-${idx}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{item.assignment.title}</CardTitle>
                    <CardDescription>{item.courseName}</CardDescription>
                  </div>
                  <Badge className="bg-primary">Turned In</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {item.assignment.maxPoints && (
                    <span>{item.assignment.maxPoints} points</span>
                  )}
                  {item.submission.late && (
                    <Badge variant="destructive">Late</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
