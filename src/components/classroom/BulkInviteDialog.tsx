import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Upload, X, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BulkInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (emails: string[]) => Promise<void>;
  type: 'teacher' | 'student';
  courseName?: string;
}

export function BulkInviteDialog({ 
  open, 
  onOpenChange, 
  onInvite, 
  type,
  courseName 
}: BulkInviteDialogProps) {
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const parseCSV = (content: string): string[] => {
    const lines = content.split(/[\r\n]+/).filter(Boolean);
    const parsedEmails: string[] = [];
    const newErrors: string[] = [];

    lines.forEach((line, index) => {
      // Handle comma-separated values in a line
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      
      values.forEach(value => {
        if (value && validateEmail(value)) {
          if (!parsedEmails.includes(value.toLowerCase())) {
            parsedEmails.push(value.toLowerCase());
          }
        } else if (value && value !== 'email' && value !== 'Email' && value !== 'EMAIL') {
          newErrors.push(`Line ${index + 1}: Invalid email "${value}"`);
        }
      });
    });

    setErrors(newErrors);
    return parsedEmails;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      toast.error('Please upload a CSV or TXT file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const parsedEmails = parseCSV(content);
      setEmails(parsedEmails);
      
      if (parsedEmails.length > 0) {
        toast.success(`Found ${parsedEmails.length} valid email(s)`);
      } else {
        toast.error('No valid emails found in file');
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  const handleSubmit = async () => {
    if (emails.length === 0) {
      toast.error('Please add at least one email');
      return;
    }

    setIsLoading(true);
    try {
      await onInvite(emails);
      setEmails([]);
      setErrors([]);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to invite users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmails([]);
    setErrors([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Bulk Invite {type === 'teacher' ? 'Teachers' : 'Students'}
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file with email addresses to invite multiple {type}s
            {courseName && ` to ${courseName}`} at once.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Upload CSV File</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              CSV format: one email per line, or comma-separated emails
            </p>
          </div>

          {errors.length > 0 && (
            <div className="p-3 bg-destructive/10 rounded-lg space-y-1">
              <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                <AlertCircle className="h-4 w-4" />
                Some entries were skipped:
              </div>
              <ul className="text-xs text-destructive/80 pl-6 list-disc">
                {errors.slice(0, 3).map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
                {errors.length > 3 && (
                  <li>...and {errors.length - 3} more</li>
                )}
              </ul>
            </div>
          )}

          {emails.length > 0 && (
            <div className="space-y-2">
              <Label>Emails to invite ({emails.length})</Label>
              <div className="max-h-40 overflow-y-auto p-3 border rounded-lg bg-muted/50 flex flex-wrap gap-2">
                {emails.map((email) => (
                  <Badge 
                    key={email} 
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {email}
                    <button
                      onClick={() => handleRemoveEmail(email)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">CSV Format Example:</p>
                <code className="bg-background px-2 py-1 rounded block">
                  teacher1@school.edu<br />
                  teacher2@school.edu<br />
                  teacher3@school.edu
                </code>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || emails.length === 0}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Invite {emails.length} {type}{emails.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
