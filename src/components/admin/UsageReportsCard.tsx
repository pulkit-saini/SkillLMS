import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  Clock
} from 'lucide-react';

interface UsageStats {
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: number; // minutes
  assignmentsCreatedThisWeek: number;
  submissionsThisWeek: number;
  peakUsageHour: number;
  growthRate: number; // percentage
}

interface UsageReportsCardProps {
  stats: UsageStats;
}

export function UsageReportsCard({ stats }: UsageReportsCardProps) {
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  const metrics = [
    {
      label: 'Daily Active Users',
      value: stats.dailyActiveUsers,
      icon: Users,
      color: 'text-primary',
      progress: (stats.dailyActiveUsers / stats.monthlyActiveUsers) * 100,
    },
    {
      label: 'Weekly Active Users',
      value: stats.weeklyActiveUsers,
      icon: Users,
      color: 'text-accent',
      progress: (stats.weeklyActiveUsers / stats.monthlyActiveUsers) * 100,
    },
    {
      label: 'Assignments This Week',
      value: stats.assignmentsCreatedThisWeek,
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      label: 'Submissions This Week',
      value: stats.submissionsThisWeek,
      icon: FileText,
      color: 'text-green-600',
    },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Usage Reports
            </CardTitle>
            <CardDescription>Platform engagement metrics</CardDescription>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
            stats.growthRate >= 0 
              ? 'text-green-600 bg-green-500/10' 
              : 'text-destructive bg-destructive/10'
          }`}>
            {stats.growthRate >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="font-medium">{Math.abs(stats.growthRate)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="space-y-2">
              <div className="flex items-center gap-2">
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-xs text-muted-foreground">{metric.label}</span>
              </div>
              <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
              {metric.progress !== undefined && (
                <Progress value={metric.progress} className="h-1" />
              )}
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{stats.avgSessionDuration} min</p>
              <p className="text-xs text-muted-foreground">Avg Session</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/10">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{formatHour(stats.peakUsageHour)}</p>
              <p className="text-xs text-muted-foreground">Peak Hour</p>
            </div>
          </div>
        </div>

        {/* Monthly Active Users */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Monthly Active Users</span>
            <span className="font-bold text-lg">{stats.monthlyActiveUsers}</span>
          </div>
          <Progress value={100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
