import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, Loader2, FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ExportReportsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (options: ExportOptions) => Promise<void>;
}

export interface ExportOptions {
  format: 'csv' | 'pdf';
  dateRange: '7days' | '30days' | '90days' | 'all';
  includeStudents: boolean;
  includeTeachers: boolean;
  includeCourses: boolean;
  includeSubmissions: boolean;
  includeGrades: boolean;
}

export function ExportReportsDialog({ open, onOpenChange, onExport }: ExportReportsDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [options, setOptions] = useState<ExportOptions>({
    format: 'csv',
    dateRange: '30days',
    includeStudents: true,
    includeTeachers: true,
    includeCourses: true,
    includeSubmissions: true,
    includeGrades: false,
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport(options);
      toast.success('Report exported successfully');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  const dataOptions = [
    { key: 'includeStudents', label: 'Student Data' },
    { key: 'includeTeachers', label: 'Teacher Data' },
    { key: 'includeCourses', label: 'Course Performance' },
    { key: 'includeSubmissions', label: 'Submission Statistics' },
    { key: 'includeGrades', label: 'Grade Distribution' },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Reports
          </DialogTitle>
          <DialogDescription>
            Download analytics data for your records or further analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={options.format === 'csv' ? 'default' : 'outline'}
                className="h-auto py-3 flex flex-col items-center gap-1"
                onClick={() => setOptions({ ...options, format: 'csv' })}
              >
                <FileSpreadsheet className="h-5 w-5" />
                <span className="text-sm">CSV</span>
                <span className="text-xs text-muted-foreground">Spreadsheet</span>
              </Button>
              <Button
                type="button"
                variant={options.format === 'pdf' ? 'default' : 'outline'}
                className="h-auto py-3 flex flex-col items-center gap-1"
                onClick={() => setOptions({ ...options, format: 'pdf' })}
              >
                <FileText className="h-5 w-5" />
                <span className="text-sm">PDF</span>
                <span className="text-xs text-muted-foreground">Document</span>
              </Button>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select
              value={options.dateRange}
              onValueChange={(value) => setOptions({ ...options, dateRange: value as ExportOptions['dateRange'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data to Include */}
          <div className="space-y-3">
            <Label>Data to Include</Label>
            <div className="space-y-2">
              {dataOptions.map((opt) => (
                <div key={opt.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={opt.key}
                    checked={options[opt.key]}
                    onCheckedChange={(checked) => 
                      setOptions({ ...options, [opt.key]: checked as boolean })
                    }
                  />
                  <Label htmlFor={opt.key} className="text-sm font-normal cursor-pointer">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
