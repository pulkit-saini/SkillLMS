import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  ClipboardList, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  UserX
} from 'lucide-react';
import { SchoolOverview } from '@/types/adminAnalytics';

interface SchoolOverviewCardsProps {
  overview: SchoolOverview;
}

export function SchoolOverviewCards({ overview }: SchoolOverviewCardsProps) {
  const primaryStats = [
    {
      title: 'Total Courses',
      value: overview.totalCourses,
      subValue: `${overview.activeCourses} active`,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Teachers',
      value: overview.totalTeachers,
      icon: GraduationCap,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Students',
      value: overview.totalStudents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Assignments',
      value: overview.totalAssignments,
      icon: ClipboardList,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  const performanceStats = [
    {
      title: 'Submission Rate',
      value: `${overview.overallSubmissionRate}%`,
      icon: CheckCircle,
      color: overview.overallSubmissionRate >= 80 ? 'text-green-600' : overview.overallSubmissionRate >= 60 ? 'text-yellow-600' : 'text-destructive',
      bgColor: overview.overallSubmissionRate >= 80 ? 'bg-green-500/10' : overview.overallSubmissionRate >= 60 ? 'bg-yellow-500/10' : 'bg-destructive/10',
      description: 'Overall completion rate',
    },
    {
      title: 'Late Rate',
      value: `${overview.overallLateRate}%`,
      icon: TrendingUp,
      color: overview.overallLateRate <= 10 ? 'text-green-600' : overview.overallLateRate <= 25 ? 'text-yellow-600' : 'text-destructive',
      bgColor: overview.overallLateRate <= 10 ? 'bg-green-500/10' : overview.overallLateRate <= 25 ? 'bg-yellow-500/10' : 'bg-destructive/10',
      description: 'Late submissions',
    },
    {
      title: 'At-Risk Students',
      value: overview.atRiskStudentsCount,
      icon: AlertTriangle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
      description: '50-80% completion',
    },
    {
      title: 'Inactive Students',
      value: overview.inactiveStudentsCount,
      icon: UserX,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      description: '<50% completion',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Primary Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {primaryStats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              {stat.subValue && (
                <p className="text-xs text-muted-foreground mt-1">{stat.subValue}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceStats.map((stat) => (
          <Card key={stat.title} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
