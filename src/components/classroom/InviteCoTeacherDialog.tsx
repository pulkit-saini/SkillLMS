import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserPlus, Loader2, Info, CheckCircle, XCircle } from 'lucide-react';
import { classroomService } from '@/services/classroomService';
import { toast } from 'sonner';

interface InviteCoTeacherDialogProps {
  courseId: string;
  courseName: string;
  token: string;
  onSuccess?: () => void;
}

export function InviteCoTeacherDialog({ courseId, courseName, token, onSuccess }: InviteCoTeacherDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleInvite = async () => {
    if (!email.trim()) return;
    
    setIsInviting(true);
    setResult(null);
    
    try {
      await classroomService.inviteTeacher(token, courseId, email.trim());
      setResult({ success: true, message: `Invitation sent to ${email}` });
      toast.success(`Co-teacher invitation sent to ${email}`);
      setEmail('');
      onSuccess?.();
      
      // Close dialog after brief delay to show success
      setTimeout(() => {
        setOpen(false);
        setResult(null);
      }, 1500);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to send invitation';
      // Parse common error messages
      if (errorMessage.includes('already a teacher')) {
        setResult({ success: false, message: 'This user is already a teacher in this course.' });
      } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        setResult({ success: false, message: 'User not found. Make sure the email address is correct.' });
      } else if (errorMessage.includes('permission') || errorMessage.includes('403')) {
        setResult({ success: false, message: 'You do not have permission to invite teachers to this course.' });
      } else {
        setResult({ success: false, message: errorMessage });
      }
      toast.error('Failed to send invitation');
    } finally {
      setIsInviting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setEmail('');
      setResult(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Co-Teacher
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Co-Teacher
          </DialogTitle>
          <DialogDescription>
            Add a co-teacher to <strong>{courseName}</strong>. They will receive an invitation to join the course.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert className="border-blue-500/50 bg-blue-50 dark:bg-blue-950/20">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200 text-sm">
              External Gmail users can be invited as co-teachers. They will have teacher access once they accept the invitation.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="teacher-email">Teacher's Email Address</Label>
            <Input
              id="teacher-email"
              type="email"
              placeholder="teacher@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isInviting && handleInvite()}
              disabled={isInviting}
            />
          </div>

          {result && (
            <Alert variant={result.success ? 'default' : 'destructive'} className={result.success ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20' : ''}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertDescription className={result.success ? 'text-green-800 dark:text-green-200' : ''}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isInviting}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={isInviting || !email.trim()}>
            {isInviting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Send Invitation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
