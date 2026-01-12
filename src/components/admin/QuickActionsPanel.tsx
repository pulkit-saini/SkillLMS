import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  UserPlus, 
  FileText, 
  Download, 
  Settings,
  Mail,
  BookOpen,
  Shield
} from 'lucide-react';

export function QuickActionsPanel() {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Create Class',
      description: 'Add a new course',
      icon: Plus,
      onClick: () => navigate('/admin/create-class'),
      color: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20',
    },
    {
      title: 'Add Teachers',
      description: 'Invite educators',
      icon: UserPlus,
      onClick: () => navigate('/admin/teachers'),
      color: 'text-accent',
      bgColor: 'bg-accent/10 hover:bg-accent/20',
    },
    {
      title: 'Manage Students',
      description: 'View all students',
      icon: BookOpen,
      onClick: () => navigate('/admin/students'),
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10 hover:bg-blue-500/20',
    },
    {
      title: 'Export Reports',
      description: 'Download analytics',
      icon: Download,
      onClick: () => {},
      color: 'text-green-600',
      bgColor: 'bg-green-500/10 hover:bg-green-500/20',
    },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="ghost"
              className={`h-auto flex flex-col items-center justify-center p-4 ${action.bgColor} transition-colors`}
              onClick={action.onClick}
            >
              <action.icon className={`h-6 w-6 ${action.color} mb-2`} />
              <span className="font-medium text-sm">{action.title}</span>
              <span className="text-xs text-muted-foreground">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
