import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, Teacher } from '@/services/classroomService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { GraduationCap, Loader2, ExternalLink } from 'lucide-react';

export default function AdminTeachersPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, [token]);

  const fetchTeachers = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const courses = await classroomService.getCourses(token);
      const teachersMap = new Map<string, Teacher>();

      for (const course of courses) {
        const courseTeachers = await classroomService.getTeachers(token, course.id);
        courseTeachers.forEach(t => teachersMap.set(t.userId, t));
      }

      setTeachers(Array.from(teachersMap.values()));
    } catch (error) {
      toast.error('Failed to load teachers');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
        <p className="text-muted-foreground">All teachers in your organization</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Teachers ({teachers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teachers.length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center py-8">No teachers found</p>
              ) : (
                teachers.map((teacher) => (
                  <div 
                    key={teacher.userId} 
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border cursor-pointer hover:bg-secondary/80 hover:border-primary/30 transition-all group"
                    onClick={() => navigate(`/admin/teacher/${teacher.userId}`)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={teacher.profile?.photoUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {teacher.profile?.name?.givenName?.[0]}{teacher.profile?.name?.familyName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate flex items-center gap-1">
                        {teacher.profile?.name?.fullName || teacher.userId}
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {teacher.profile?.emailAddress}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
