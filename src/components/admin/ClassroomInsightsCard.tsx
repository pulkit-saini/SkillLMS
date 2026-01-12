import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'info';
  title: string;
  description: string;
  metric?: string;
  change?: number;
}

interface ClassroomInsightsCardProps {
  insights: Insight[];
}

const insightStyles = {
  positive: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
};

export function ClassroomInsightsCard({ insights }: ClassroomInsightsCardProps) {
  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          AI Insights
        </CardTitle>
        <CardDescription>Automated analysis and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Lightbulb className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No insights available yet</p>
            <p className="text-xs text-muted-foreground mt-1">Check back later for analysis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => {
              const style = insightStyles[insight.type];
              const Icon = style.icon;

              return (
                <div 
                  key={insight.id}
                  className={`p-4 rounded-lg ${style.bgColor} border ${style.borderColor}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 ${style.color} shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        {insight.change !== undefined && (
                          <div className={`flex items-center gap-1 text-xs ${
                            insight.change >= 0 ? 'text-green-600' : 'text-destructive'
                          }`}>
                            {insight.change >= 0 ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <TrendingDown className="h-3 w-3" />
                            )}
                            {Math.abs(insight.change)}%
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {insight.description}
                      </p>
                      {insight.metric && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {insight.metric}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
