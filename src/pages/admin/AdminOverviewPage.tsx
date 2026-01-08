import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { BookOpen, Loader2, BarChart3, TrendingUp, GraduationCap, Users } from 'lucide-react';

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<{ totalCourses: number; totalTeachers: number; totalStudents: number } | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [token]);

  const fetchStats = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const statsData = await classroomService.getStats(token);
      setStats({
        totalCourses: statsData.totalCourses,
        totalTeachers: statsData.totalTeachers,
        totalStudents: statsData.totalStudents,
      });
      setCourses(statsData.courses.slice(0, 5)); // Show latest 5 courses
    } catch (error) {
      toast.error('Failed to load admin stats');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your organization's Classroom data</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalCourses || 0}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-primary" />
                  Active classes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Teachers
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalTeachers || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all courses</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary to-secondary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalStudents || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Enrolled students</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Courses
              </CardTitle>
              <CardDescription>Latest courses in your domain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No courses found</p>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {course.section || 'No section'} {course.room && `• ${course.room}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={course.courseState === 'ACTIVE' ? 'default' : 'secondary'}>
                        {course.courseState}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
