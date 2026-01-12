import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { driveService, DriveFile } from '@/services/driveService';
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  FileText,
  Image,
  FileVideo,
  FileAudio
} from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  token: string;
  onFileUploaded: (file: DriveFile) => void;
  onCancel?: () => void;
  maxSizeMB?: number;
  acceptedTypes?: string;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'success' | 'error';
  progress: number;
  file?: File;
  driveFile?: DriveFile;
  error?: string;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return FileVideo;
  if (mimeType.startsWith('audio/')) return FileAudio;
  return FileText;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUpload = ({ 
  token, 
  onFileUploaded, 
  onCancel,
  maxSizeMB = 25,
  acceptedTypes = '*/*'
}: FileUploadProps) => {
  const [uploadState, setUploadState] = useState<UploadState>({ 
    status: 'idle', 
    progress: 0 
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error(`File too large. Maximum size is ${maxSizeMB}MB`);
      return;
    }

    setUploadState({ status: 'uploading', progress: 10, file });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90)
        }));
      }, 200);

      const driveFile = await driveService.uploadFile(token, file);
      
      clearInterval(progressInterval);
      setUploadState({ 
        status: 'success', 
        progress: 100, 
        file, 
        driveFile 
      });

      onFileUploaded(driveFile);
      toast.success('File uploaded successfully!');
    } catch (error: any) {
      setUploadState({ 
        status: 'error', 
        progress: 0, 
        file, 
        error: error.message 
      });
      toast.error(error.message || 'Failed to upload file');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const resetUpload = () => {
    setUploadState({ status: 'idle', progress: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const FileIcon = uploadState.file ? getFileIcon(uploadState.file.type) : File;

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={handleInputChange}
        className="hidden"
      />

      {uploadState.status === 'idle' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
            }
          `}
        >
          <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-foreground font-medium mb-1">
            Drop your file here or click to browse
          </p>
          <p className="text-sm text-muted-foreground">
            Maximum file size: {maxSizeMB}MB
          </p>
        </div>
      )}

      {uploadState.status === 'uploading' && uploadState.file && (
        <div className="border rounded-xl p-4 bg-secondary/30">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileIcon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{uploadState.file.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(uploadState.file.size)}
              </p>
            </div>
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
          <Progress value={uploadState.progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            Uploading to Google Drive...
          </p>
        </div>
      )}

      {uploadState.status === 'success' && uploadState.file && (
        <div className="border border-primary/30 rounded-xl p-4 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{uploadState.file.name}</p>
              <p className="text-sm text-muted-foreground">
                Uploaded successfully
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetUpload}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {uploadState.status === 'error' && uploadState.file && (
        <div className="border border-destructive/30 rounded-xl p-4 bg-destructive/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{uploadState.file.name}</p>
              <p className="text-sm text-destructive">
                {uploadState.error || 'Upload failed'}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={resetUpload}>
              Try Again
            </Button>
          </div>
        </div>
      )}

      {onCancel && uploadState.status !== 'uploading' && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
