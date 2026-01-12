import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users2, 
  Mail, 
  CheckCircle, 
  Clock,
  AlertTriangle,
  Send
} from 'lucide-react';

interface GuardianStats {
  totalGuardians: number;
  activeGuardians: number;
  pendingInvites: number;
  emailsSentThisMonth: number;
  summaryOpenRate: number;
}

interface GuardianSummaryCardProps {
  stats: GuardianStats;
  onSendSummaries?: () => void;
}

export function GuardianSummaryCard({ stats, onSendSummaries }: GuardianSummaryCardProps) {
  const engagementLevel = stats.summaryOpenRate >= 70 ? 'high' : stats.summaryOpenRate >= 40 ? 'medium' : 'low';
  
  const engagementColors = {
    high: 'text-green-600 bg-green-500/10',
    medium: 'text-yellow-600 bg-yellow-500/10',
    low: 'text-destructive bg-destructive/10',
  };

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users2 className="h-5 w-5 text-primary" />
              Guardian Summaries
            </CardTitle>
            <CardDescription>Parent/Guardian engagement tracking</CardDescription>
          </div>
          <Badge className={engagementColors[engagementLevel]}>
            {engagementLevel.charAt(0).toUpperCase() + engagementLevel.slice(1)} Engagement
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Active Guardians</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{stats.activeGuardians}</p>
            <p className="text-xs text-muted-foreground">of {stats.totalGuardians} total</p>
          </div>
          
          <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-xs text-muted-foreground">Pending Invites</span>
            </div>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingInvites}</p>
            <p className="text-xs text-muted-foreground">awaiting acceptance</p>
          </div>
        </div>

        {/* Email Stats */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Email Summaries</span>
            </div>
            <span className="text-sm text-muted-foreground">{stats.emailsSentThisMonth} sent this month</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Open Rate</span>
                <span className="text-sm font-medium">{stats.summaryOpenRate}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    stats.summaryOpenRate >= 70 ? 'bg-green-600' :
                    stats.summaryOpenRate >= 40 ? 'bg-yellow-600' : 'bg-destructive'
                  }`}
                  style={{ width: `${stats.summaryOpenRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Low Engagement Warning */}
        {engagementLevel === 'low' && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Low Guardian Engagement</p>
              <p className="text-xs text-muted-foreground">
                Consider sending more frequent updates or personalized summaries to increase engagement.
              </p>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button className="w-full" onClick={onSendSummaries}>
          <Send className="h-4 w-4 mr-2" />
          Send Weekly Summaries
        </Button>
      </CardContent>
    </Card>
  );
}
