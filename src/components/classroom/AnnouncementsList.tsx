import { Announcement } from "@/services/classroomService";
import { Megaphone, ExternalLink, FileText, Link as LinkIcon, Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface AnnouncementsListProps {
  announcements: Announcement[];
  loading: boolean;
}

export const AnnouncementsList = ({ announcements, loading }: AnnouncementsListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-card rounded-xl border border-border/50 p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-3" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
          <Megaphone className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-medium">No Announcements</p>
        <p className="text-sm text-muted-foreground">There are no announcements for this class yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((announcement) => (
        <div 
          key={announcement.id} 
          className="bg-card rounded-xl border border-border/50 p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                {announcement.text}
              </p>
              
              {announcement.materials && announcement.materials.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {announcement.materials.map((material, idx) => (
                    <MaterialBadge key={idx} material={material} />
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {announcement.creationTime && format(new Date(announcement.creationTime), 'MMM d, yyyy h:mm a')}
              </div>
            </div>
            
            {announcement.alternateLink && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(announcement.alternateLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const MaterialBadge = ({ material }: { material: any }) => {
  if (material.driveFile) {
    return (
      <a
        href={material.driveFile.driveFile.alternateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors"
      >
        <FileText className="w-3.5 h-3.5 text-primary" />
        <span className="truncate max-w-[150px]">{material.driveFile.driveFile.title}</span>
      </a>
    );
  }
  
  if (material.link) {
    return (
      <a
        href={material.link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-sm transition-colors"
      >
        <LinkIcon className="w-3.5 h-3.5 text-accent" />
        <span className="truncate max-w-[150px]">{material.link.title || 'Link'}</span>
      </a>
    );
  }
  
  if (material.youtubeVideo) {
    return (
      <a
        href={material.youtubeVideo.alternateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 hover:opacity-80 rounded-lg text-sm transition-colors"
      >
        <Video className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
        <span className="truncate max-w-[150px]">{material.youtubeVideo.title}</span>
      </a>
    );
  }
  
  return null;
};
