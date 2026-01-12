import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Search, ArrowUpDown, AlertTriangle, Users } from 'lucide-react';
import { CoursePerformance } from '@/types/adminAnalytics';

interface CoursePerformanceTableProps {
  courses: CoursePerformance[];
}

export function CoursePerformanceTable({ courses }: CoursePerformanceTableProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'students' | 'rate' | 'risk'>('rate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filteredCourses = courses
    .filter(c => 
      c.courseName.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.courseName.localeCompare(b.courseName);
          break;
        case 'students':
          comparison = a.studentCount - b.studentCount;
          break;
        case 'rate':
          comparison = a.submissionRate - b.submissionRate;
          break;
        case 'risk':
          comparison = a.atRiskStudents - b.atRiskStudents;
          break;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('desc');
    }
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 80) return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Excellent</Badge>;
    if (rate >= 60) return <Badge className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30">Average</Badge>;
    return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">Needs Attention</Badge>;
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Course Performance
            </CardTitle>
            <CardDescription>Compare performance across all courses</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 -ml-3"
                    onClick={() => handleSort('name')}
                  >
                    Course
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 -ml-3"
                    onClick={() => handleSort('students')}
                  >
                    <Users className="h-3 w-3" />
                    Students
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 -ml-3"
                    onClick={() => handleSort('rate')}
                  >
                    Submission Rate
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-1 -ml-3"
                    onClick={() => handleSort('risk')}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    At-Risk
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No courses found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.courseId}>
                    <TableCell className="font-medium">{course.courseName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{course.teacherName}</p>
                        {course.teacherEmail && (
                          <p className="text-xs text-muted-foreground">{course.teacherEmail}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{course.studentCount}</TableCell>
                    <TableCell>{course.assignmentCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={course.submissionRate} className="flex-1 h-2" />
                        <span className="text-sm font-medium w-10">{course.submissionRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {course.atRiskStudents > 0 ? (
                        <Badge variant="outline" className="gap-1 text-yellow-600 border-yellow-600/30">
                          <AlertTriangle className="h-3 w-3" />
                          {course.atRiskStudents}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell>{getPerformanceBadge(course.submissionRate)}</TableCell>
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
