import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, isPlatformCourse } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { BookOpen, Loader2 } from 'lucide-react';

interface StudentClassesPageProps {
  onSelectCourse: (course: Course) => void;
}

export default function StudentClassesPage({ onSelectCourse }: StudentClassesPageProps) {
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
      // Filter to only show SkillLMS platform courses
      const platformCourses = data.filter(isPlatformCourse);
      setCourses(platformCourses);
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
        <p className="text-muted-foreground">All your enrolled classes</p>
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
                <p className="text-muted-foreground">No classes enrolled</p>
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
      )}
    </div>
  );
}
