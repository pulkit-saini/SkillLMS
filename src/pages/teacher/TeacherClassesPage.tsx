import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BookOpen, Loader2 } from 'lucide-react';

interface TeacherClassesPageProps {
  onSelectCourse: (course: Course) => void;
}

export default function TeacherClassesPage({ onSelectCourse }: TeacherClassesPageProps) {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [token]);

  const fetchCourses = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await classroomService.getCourses(token);
      const teacherCourses = [];
      for (const course of data) {
        const role = await classroomService.getUserRoleInCourse(token, course.id);
        if (role === 'teacher') {
          teacherCourses.push(course);
        }
      }
      setCourses(teacherCourses);
    } catch (error) {
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Classes</h1>
        <p className="text-muted-foreground">All classes you teach</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No classes yet. Create your first class!</p>
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card 
                key={course.id} 
                className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50"
                onClick={() => onSelectCourse(course)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <Badge variant="outline">{course.courseState}</Badge>
                  </div>
                  <CardTitle className="mt-3">{course.name}</CardTitle>
                  <CardDescription>
                    {course.section && <span>{course.section}</span>}
                    {course.room && <span> • {course.room}</span>}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
