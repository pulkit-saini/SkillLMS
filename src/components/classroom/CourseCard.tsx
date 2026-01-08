import { Course } from "@/services/classroomService";
import { GraduationCap, MapPin, Users, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  course: Course;
  isSelected: boolean;
  onSelect: (courseId: string) => void;
}

export const CourseCard = ({ course, isSelected, onSelect }: CourseCardProps) => {
  return (
    <div
      onClick={() => onSelect(course.id)}
      className={`
        p-5 rounded-xl border cursor-pointer transition-all duration-200 relative overflow-hidden
        ${isSelected 
          ? 'bg-primary/10 border-primary shadow-md ring-2 ring-primary/20' 
          : 'bg-card border-border/50 hover:border-primary/30 hover:shadow-sm'
        }
      `}
    >
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <GraduationCap className="w-16 h-16" />
      </div>
      
      <div className="relative z-10">
        <h3 className={`font-semibold text-lg mb-2 line-clamp-2 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
          {course.name}
        </h3>
        
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
          {course.section && (
            <span className="flex items-center gap-1 bg-secondary/80 px-2 py-1 rounded-md">
              <Users className="w-3 h-3" /> {course.section}
            </span>
          )}
          {course.room && (
            <span className="flex items-center gap-1 bg-secondary/80 px-2 py-1 rounded-md">
              <MapPin className="w-3 h-3" /> {course.room}
            </span>
          )}
        </div>
        
        {course.descriptionHeading && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {course.descriptionHeading}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full ${
            course.courseState === 'ACTIVE' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {course.courseState || 'Active'}
          </span>
          
          {course.alternateLink && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.open(course.alternateLink, '_blank');
              }}
            >
              <ExternalLink className="w-3 h-3" />
              Open
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
