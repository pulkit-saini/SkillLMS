import { CourseMaterial } from "@/services/classroomService";
import { FileText, FolderOpen, ExternalLink, Link as LinkIcon, Video, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface MaterialsListProps {
  materials: CourseMaterial[];
  loading: boolean;
}

export const MaterialsList = ({ materials, loading }: MaterialsListProps) => {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-card rounded-xl border border-border/50 p-5 animate-pulse">
            <div className="h-5 bg-muted rounded w-3/4 mb-3" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
        <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
          <FolderOpen className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-medium">No Materials</p>
        <p className="text-sm text-muted-foreground">No course materials have been shared yet.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => (
        <div 
          key={material.id} 
          className="bg-card rounded-xl border border-border/50 p-5 shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {material.title}
            </h4>
            {material.alternateLink && (
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => window.open(material.alternateLink, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {material.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {material.description}
            </p>
          )}
          
          {material.materials && material.materials.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {material.materials.slice(0, 3).map((m, idx) => (
                <MaterialTag key={idx} material={m} />
              ))}
              {material.materials.length > 3 && (
                <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">
                  +{material.materials.length - 3} more
                </span>
              )}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {material.creationTime && format(new Date(material.creationTime), 'MMM d, yyyy')}
          </div>
        </div>
      ))}
    </div>
  );
};

const MaterialTag = ({ material }: { material: any }) => {
  if (material.driveFile) {
    return (
      <a
        href={material.driveFile.driveFile.alternateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded text-xs hover:bg-primary/20 transition-colors"
      >
        <FileText className="w-3 h-3" />
        <span className="truncate max-w-[100px]">{material.driveFile.driveFile.title}</span>
      </a>
    );
  }
  
  if (material.link) {
    return (
      <a
        href={material.link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded text-xs hover:bg-accent/20 transition-colors"
      >
        <LinkIcon className="w-3 h-3" />
        <span className="truncate max-w-[100px]">{material.link.title || 'Link'}</span>
      </a>
    );
  }
  
  if (material.youtubeVideo) {
    return (
      <a
        href={material.youtubeVideo.alternateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs hover:opacity-80 transition-colors"
      >
        <Video className="w-3 h-3" />
        <span className="truncate max-w-[100px]">{material.youtubeVideo.title}</span>
      </a>
    );
  }
  
  return null;
};
