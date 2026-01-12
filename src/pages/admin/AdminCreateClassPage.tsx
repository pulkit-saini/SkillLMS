import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Loader2, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminCreateClassPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', section: '', description: '', room: '' });
  const [ownerEmail, setOwnerEmail] = useState('');

  const handleCreateCourse = async () => {
    if (!token || !newCourse.name || !ownerEmail.trim()) return;
    setIsCreating(true);
    try {
      // Create course with ownerId (required by Google Classroom API for admin creation)
      await classroomService.createCourse(token, {
        ...newCourse,
        ownerId: ownerEmail.trim()
      });
      
      toast.success('Course created successfully!');
      setNewCourse({ name: '', section: '', description: '', room: '' });
      setOwnerEmail('');
      navigate('/admin/courses');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create course');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Class</h1>
        <p className="text-muted-foreground">Set up a new class and assign a teacher as the owner</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          As an administrator, you must assign a teacher as the course owner. The teacher's email is required.
        </AlertDescription>
      </Alert>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            New Class
          </CardTitle>
          <CardDescription>Fill in the details for your new class</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ownerEmail" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Teacher Email (Owner) *
            </Label>
            <Input 
              id="ownerEmail" 
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="teacher@school.edu"
            />
            <p className="text-xs text-muted-foreground">
              This teacher will be the primary owner of the class
            </p>
          </div>

          <div className="border-t pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name *</Label>
              <Input 
                id="name" 
                value={newCourse.name}
                onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Mathematics 101"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="section">Section</Label>
            <Input 
              id="section" 
              value={newCourse.section}
              onChange={(e) => setNewCourse(prev => ({ ...prev, section: e.target.value }))}
              placeholder="e.g., Period 3"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="room">Room</Label>
            <Input 
              id="room" 
              value={newCourse.room}
              onChange={(e) => setNewCourse(prev => ({ ...prev, room: e.target.value }))}
              placeholder="e.g., Room 204"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={newCourse.description}
              onChange={(e) => setNewCourse(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Course description..."
            />
          </div>

          <Button 
            onClick={handleCreateCourse} 
            disabled={isCreating || !newCourse.name || !ownerEmail.trim()} 
            className="w-full"
          >
            {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Class
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
