import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomService } from '@/services/classroomService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TeacherCreateClassPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', section: '', description: '', room: '' });

  const handleCreateCourse = async () => {
    if (!token || !newCourse.name) return;
    setIsCreating(true);
    try {
      await classroomService.createCourse(token, newCourse);
      toast.success('Course created successfully!');
      setNewCourse({ name: '', section: '', description: '', room: '' });
      navigate('/teacher');
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
        <p className="text-muted-foreground">Set up a new class for your students</p>
      </div>

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
            <Label htmlFor="name">Class Name *</Label>
            <Input 
              id="name" 
              value={newCourse.name}
              onChange={(e) => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Mathematics 101"
            />
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
          <Button onClick={handleCreateCourse} disabled={isCreating || !newCourse.name} className="w-full">
            {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Create Class
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
