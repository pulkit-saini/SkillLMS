import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Megaphone, 
  Plus, 
  Clock,
  Eye,
  Trash2,
  Edit
} from 'lucide-react';
import { format, parseISO, formatDistanceToNow } from 'date-fns';

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  viewCount: number;
  courseCount: number;
  isActive: boolean;
}

interface AnnouncementsBannerProps {
  announcements: SchoolAnnouncement[];
  onCreateAnnouncement?: () => void;
  onEditAnnouncement?: (id: string) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

export function AnnouncementsBanner({ 
  announcements, 
  onCreateAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement
}: AnnouncementsBannerProps) {
  const activeAnnouncements = announcements.filter(a => a.isActive);
  
  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-primary" />
              School Announcements
            </CardTitle>
            <CardDescription>Broadcast messages to all courses</CardDescription>
          </div>
          <Button size="sm" onClick={onCreateAnnouncement}>
            <Plus className="h-4 w-4 mr-1" />
            New Announcement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Megaphone className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No announcements yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Create an announcement to share with all courses
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div 
                  key={announcement.id}
                  className={`p-4 rounded-lg border ${
                    announcement.isActive 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-secondary/50 border-border/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{announcement.title}</h4>
                        {announcement.isActive && (
                          <Badge variant="default" className="text-xs">Active</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(parseISO(announcement.createdAt), { addSuffix: true })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {announcement.viewCount} views
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {announcement.courseCount} courses
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onEditAnnouncement?.(announcement.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDeleteAnnouncement?.(announcement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
