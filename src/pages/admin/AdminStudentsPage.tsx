import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService, Course, Student } from '@/services/classroomService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Users, Loader2 } from 'lucide-react';

export default function AdminStudentsPage() {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const fetchStudents = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const courses = await classroomService.getCourses(token);
      const studentsMap = new Map<string, Student>();

      for (const course of courses) {
        const courseStudents = await classroomService.getStudents(token, course.id);
        courseStudents.forEach(s => studentsMap.set(s.userId, s));
      }

      setStudents(Array.from(studentsMap.values()));
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Students</h1>
        <p className="text-muted-foreground">All students in your organization</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Students ({students.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {students.length === 0 ? (
                <p className="text-muted-foreground col-span-full text-center py-8">No students found</p>
              ) : (
                students.map((student) => (
                  <div key={student.userId} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 border">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.profile?.photoUrl} />
                      <AvatarFallback className="bg-accent/10 text-accent">
                        {student.profile?.name?.givenName?.[0]}{student.profile?.name?.familyName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {student.profile?.name?.fullName || student.userId}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {student.profile?.emailAddress}
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
