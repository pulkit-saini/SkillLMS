import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AssignmentAnalytics } from '@/types/analytics';
import { FileText, Calendar } from 'lucide-react';

interface AssignmentStatsProps {
  assignments: AssignmentAnalytics[];
  viewMode?: 'table' | 'chart';
}

export function AssignmentStats({ assignments, viewMode = 'table' }: AssignmentStatsProps) {
  if (assignments.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No assignments found</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for chart
  const chartData = assignments.slice(0, 10).map((a) => ({
    name: a.title.length > 15 ? a.title.slice(0, 15) + '...' : a.title,
    submitted: a.submittedCount,
    missing: a.missingCount,
    late: a.lateCount,
  }));

  if (viewMode === 'chart') {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Assignment Performance
          </CardTitle>
          <CardDescription>Submission breakdown by assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="submitted" stackId="a" fill="hsl(142 76% 36%)" name="Submitted" />
                <Bar dataKey="late" stackId="a" fill="hsl(48 96% 53%)" name="Late" />
                <Bar dataKey="missing" stackId="a" fill="hsl(var(--destructive))" name="Missing" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Assignment Performance
        </CardTitle>
        <CardDescription>Submission status per assignment</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="p-4 rounded-lg bg-secondary/30 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">{assignment.title}</h4>
                    {assignment.dueDate && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        Due: {assignment.dueDate}
                      </p>
                    )}
                  </div>
                  {assignment.maxPoints && (
                    <Badge variant="outline" className="shrink-0">
                      {assignment.maxPoints} pts
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submission Rate</span>
                    <span className="font-medium">{Math.round(assignment.submissionRate)}%</span>
                  </div>
                  <Progress 
                    value={assignment.submissionRate} 
                    className="h-2"
                  />
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700">
                    ✓ {assignment.submittedCount} submitted
                  </Badge>
                  {assignment.lateCount > 0 && (
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700">
                      ⏰ {assignment.lateCount} late
                    </Badge>
                  )}
                  {assignment.missingCount > 0 && (
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                      ✕ {assignment.missingCount} missing
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
