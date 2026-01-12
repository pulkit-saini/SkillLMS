import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  FileText, 
  UserPlus, 
  CheckCircle, 
  Clock,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';

export interface ActivityItem {
  id: string;
  type: 'submission' | 'enrollment' | 'assignment' | 'announcement' | 'grade';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email?: string;
    photoUrl?: string;
  };
  courseName?: string;
  metadata?: {
    late?: boolean;
    grade?: number;
  };
}

interface RecentActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

const activityIcons = {
  submission: CheckCircle,
  enrollment: UserPlus,
  assignment: FileText,
  announcement: MessageSquare,
  grade: BookOpen,
};

const activityColors = {
  submission: 'text-green-600 bg-green-500/10',
  enrollment: 'text-blue-600 bg-blue-500/10',
  assignment: 'text-purple-600 bg-purple-500/10',
  announcement: 'text-yellow-600 bg-yellow-500/10',
  grade: 'text-accent bg-accent/10',
};

export function RecentActivityFeed({ activities, isLoading }: RecentActivityFeedProps) {
  if (isLoading) {
    return (
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest actions across all courses</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type];
                const colorClass = activityColors[activity.type];

                return (
                  <div key={activity.id} className="flex gap-3 pb-4 border-b border-border/50 last:border-0">
                    <div className={`p-2 rounded-full h-10 w-10 flex items-center justify-center ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(parseISO(activity.timestamp), { addSuffix: true })}
                          </span>
                          {activity.metadata?.late && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600/30 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Late
                            </Badge>
                          )}
                        </div>
                      </div>
                      {activity.courseName && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {activity.courseName}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
