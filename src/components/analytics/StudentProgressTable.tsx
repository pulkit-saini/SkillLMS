import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StudentAnalytics } from '@/types/analytics';
import { Users, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface StudentProgressTableProps {
  students: StudentAnalytics[];
}

const statusConfig = {
  good: {
    label: 'Good',
    icon: CheckCircle,
    className: 'bg-green-500/10 text-green-700 border-green-200',
  },
  'at-risk': {
    label: 'At Risk',
    icon: AlertTriangle,
    className: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  },
  inactive: {
    label: 'Inactive',
    icon: XCircle,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function StudentProgressTable({ students }: StudentProgressTableProps) {
  if (students.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No students enrolled</p>
        </CardContent>
      </Card>
    );
  }

  // Sort by status (inactive first, then at-risk, then good)
  const sortedStudents = [...students].sort((a, b) => {
    const statusOrder = { inactive: 0, 'at-risk': 1, good: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  const statusCounts = {
    good: students.filter((s) => s.status === 'good').length,
    'at-risk': students.filter((s) => s.status === 'at-risk').length,
    inactive: students.filter((s) => s.status === 'inactive').length,
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Student Progress
            </CardTitle>
            <CardDescription>Individual student performance overview</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className={statusConfig.good.className}>
              ✓ {statusCounts.good}
            </Badge>
            <Badge variant="outline" className={statusConfig['at-risk'].className}>
              ⚠ {statusCounts['at-risk']}
            </Badge>
            <Badge variant="outline" className={statusConfig.inactive.className}>
              ✕ {statusCounts.inactive}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Student</TableHead>
                <TableHead className="text-center">Submission %</TableHead>
                <TableHead className="text-center">Missing</TableHead>
                <TableHead className="text-center">Late</TableHead>
                <TableHead>Last Submission</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => {
                const config = statusConfig[student.status];
                const StatusIcon = config.icon;
                
                return (
                  <TableRow key={student.userId}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={student.photoUrl} alt={student.name} />
                          <AvatarFallback className="text-xs bg-secondary">
                            {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate">{student.name}</p>
                          {student.email && (
                            <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-center">
                        <Progress 
                          value={student.submissionPercentage} 
                          className="w-16 h-2"
                        />
                        <span className="text-sm font-medium w-10 text-right">
                          {student.submissionPercentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={student.missingCount > 0 ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                        {student.missingCount}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={student.lateCount > 0 ? 'text-yellow-600 font-medium' : 'text-muted-foreground'}>
                        {student.lateCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {student.lastSubmissionDate || '—'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={config.className}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {config.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
