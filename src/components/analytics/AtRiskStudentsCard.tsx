import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, UserX, ExternalLink } from 'lucide-react';
import { StudentAnalytics } from '@/types/analytics';

interface AtRiskStudentsCardProps {
  students: StudentAnalytics[];
}

export function AtRiskStudentsCard({ students }: AtRiskStudentsCardProps) {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleStudentClick = (studentId: string) => {
    navigate(`/admin/student/${studentId}`);
  };
  const atRiskStudents = students.filter(s => s.status === 'at-risk');
  const inactiveStudents = students.filter(s => s.status === 'inactive');

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          Students Needing Attention
        </CardTitle>
        <CardDescription>
          {students.length} students with low engagement across all courses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <UserX className="h-12 w-12 mb-2 opacity-50" />
            <p>No at-risk students found</p>
            <p className="text-sm">All students are performing well!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary badges */}
            <div className="flex gap-2">
              <Badge variant="outline" className="text-yellow-600 border-yellow-600/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {atRiskStudents.length} At-Risk
              </Badge>
              <Badge variant="outline" className="text-destructive border-destructive/30">
                <UserX className="h-3 w-3 mr-1" />
                {inactiveStudents.length} Inactive
              </Badge>
            </div>

            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {students.slice(0, 20).map((student) => (
                  <div 
                    key={student.userId}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    onClick={() => handleStudentClick(student.userId)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={student.photoUrl} />
                        <AvatarFallback className={`${student.status === 'inactive' ? 'bg-destructive/10 text-destructive' : 'bg-yellow-500/10 text-yellow-600'}`}>
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-1">
                          {student.name}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.submittedCount} of {student.submittedCount + student.missingCount} submitted
                          {student.lateCount > 0 && ` • ${student.lateCount} late`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20">
                        <Progress 
                          value={student.submissionPercentage} 
                          className="h-2"
                        />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={student.status === 'inactive' 
                          ? 'text-destructive border-destructive/30' 
                          : 'text-yellow-600 border-yellow-600/30'
                        }
                      >
                        {student.submissionPercentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
