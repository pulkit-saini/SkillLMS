import { CourseWork } from "@/services/classroomService";
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Link as LinkIcon, 
  ExternalLink,
  AlertCircle,
  Calendar,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface AssignmentCardProps {
  assignment: CourseWork;
  onAddLink: (assignment: CourseWork) => void;
  onTurnIn: (assignment: CourseWork) => void;
  onReclaim: (assignment: CourseWork) => void;
}

export const AssignmentCard = ({ assignment, onAddLink, onTurnIn, onReclaim }: AssignmentCardProps) => {
  const submission = assignment.submission;
  const isTurnedIn = submission?.state === 'TURNED_IN' || submission?.state === 'RETURNED';
  const isReturned = submission?.state === 'RETURNED';
  const isLate = submission?.late;
  
  const getDueDate = () => {
    if (!assignment.dueDate) return null;
    const { year, month, day } = assignment.dueDate;
    return new Date(year, month - 1, day);
  };
  
  const dueDate = getDueDate();
  const isOverdue = dueDate && new Date() > dueDate && !isTurnedIn;
  
  const getStatusBadge = () => {
    if (isReturned) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          <Award className="w-3 h-3" />
          Graded {submission?.assignedGrade !== undefined && `• ${submission.assignedGrade}/${assignment.maxPoints || 100}`}
        </span>
      );
    }
    if (isTurnedIn) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3" />
          Turned In {isLate && '(Late)'}
        </span>
      );
    }
    if (isOverdue) {
      return (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="w-3 h-3" />
          Missing
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
        <FileText className="w-3 h-3" />
        Assigned
      </span>
    );
  };

  return (
    <div className={`
      bg-card rounded-xl border p-6 shadow-sm hover:shadow-md transition-all
      ${isOverdue ? 'border-red-200 dark:border-red-900/50' : 'border-border/50'}
    `}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-2">
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center shrink-0
              ${isTurnedIn ? 'bg-green-100 dark:bg-green-900/30' : isOverdue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-primary/10'}
            `}>
              <FileText className={`w-5 h-5 ${isTurnedIn ? 'text-green-600 dark:text-green-400' : isOverdue ? 'text-red-600 dark:text-red-400' : 'text-primary'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">{assignment.title}</h3>
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge()}
                {assignment.maxPoints && (
                  <span className="text-xs text-muted-foreground">
                    {assignment.maxPoints} points
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {assignment.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 ml-13 mb-3">
              {assignment.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground ml-13">
            {dueDate && (
              <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
                <Calendar className="w-3 h-3" />
                Due: {format(dueDate, 'MMM d, yyyy')}
                {assignment.dueTime && ` at ${assignment.dueTime.hours}:${String(assignment.dueTime.minutes || 0).padStart(2, '0')}`}
              </span>
            )}
            {assignment.workType && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {assignment.workType.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isTurnedIn && submission && (
            <>
              <Button variant="outline" size="sm" onClick={() => onAddLink(assignment)} className="gap-2">
                <LinkIcon className="w-4 h-4" /> Attach Link
              </Button>
              <Button size="sm" onClick={() => onTurnIn(assignment)}>
                Turn In
              </Button>
            </>
          )}
          
          {isTurnedIn && !isReturned && submission && (
            <Button variant="outline" size="sm" onClick={() => onReclaim(assignment)} className="gap-2">
              Unsubmit
            </Button>
          )}
          
          {isReturned && (
            <Button variant="ghost" size="sm" disabled className="text-green-600 dark:text-green-400 opacity-100 gap-2">
              <CheckCircle2 className="w-4 h-4" /> Graded
            </Button>
          )}
          
          {assignment.alternateLink && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(assignment.alternateLink, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
