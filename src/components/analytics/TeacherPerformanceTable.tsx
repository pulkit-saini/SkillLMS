import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { GraduationCap, Users, BookOpen, ClipboardList, ExternalLink } from 'lucide-react';
import { TeacherPerformance } from '@/types/adminAnalytics';

interface TeacherPerformanceTableProps {
  teachers: TeacherPerformance[];
}

export function TeacherPerformanceTable({ teachers }: TeacherPerformanceTableProps) {
  const navigate = useNavigate();
  const sortedTeachers = [...teachers].sort((a, b) => b.averageSubmissionRate - a.averageSubmissionRate);

  const handleTeacherClick = (teacherId: string) => {
    navigate(`/admin/teacher/${teacherId}`);
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 80) return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Excellent</Badge>;
    if (rate >= 60) return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Good</Badge>;
    return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">Needs Support</Badge>;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Teacher Performance
        </CardTitle>
        <CardDescription>Overview of teacher engagement and student success rates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Courses
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Students
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <ClipboardList className="h-3 w-3" />
                    Assignments
                  </div>
                </TableHead>
                <TableHead>Submission Rate</TableHead>
                <TableHead>Late Rate</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTeachers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No teacher data available
                  </TableCell>
                </TableRow>
              ) : (
                sortedTeachers.map((teacher) => (
                  <TableRow 
                    key={teacher.userId}
                    className="cursor-pointer hover:bg-secondary/50 group"
                    onClick={() => handleTeacherClick(teacher.userId)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={teacher.photoUrl} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(teacher.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium flex items-center gap-1">
                            {teacher.name}
                            <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                          </p>
                          {teacher.email && (
                            <p className="text-xs text-muted-foreground">{teacher.email}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{teacher.coursesCount}</Badge>
                    </TableCell>
                    <TableCell>{teacher.totalStudents}</TableCell>
                    <TableCell>{teacher.totalAssignments}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={teacher.averageSubmissionRate} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-10">{teacher.averageSubmissionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={teacher.averageLateRate <= 10 ? 'text-green-600' : teacher.averageLateRate <= 25 ? 'text-yellow-600' : 'text-destructive'}>
                        {teacher.averageLateRate}%
                      </span>
                    </TableCell>
                    <TableCell>{getPerformanceBadge(teacher.averageSubmissionRate)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
