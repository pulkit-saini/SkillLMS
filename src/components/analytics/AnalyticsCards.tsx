import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardList, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { AnalyticsSummary } from '@/types/analytics';

interface AnalyticsCardsProps {
  summary: AnalyticsSummary;
}

export function AnalyticsCards({ summary }: AnalyticsCardsProps) {
  const cards = [
    {
      title: 'Total Students',
      value: summary.totalStudents,
      icon: Users,
      description: 'Enrolled across courses',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Assignments Posted',
      value: summary.totalAssignments,
      icon: ClipboardList,
      description: 'Total assignments created',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Total Submissions',
      value: summary.totalSubmissions,
      icon: CheckCircle,
      description: 'Submitted work',
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Late Submissions',
      value: summary.lateSubmissions,
      icon: AlertTriangle,
      description: 'Submitted after due date',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Missing Submissions',
      value: summary.missingSubmissions,
      icon: XCircle,
      description: 'Not yet submitted',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
