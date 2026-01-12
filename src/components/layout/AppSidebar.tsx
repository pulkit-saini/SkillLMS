import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  ClipboardList, 
  BarChart3, 
  Settings,
  Home,
  CheckSquare,
  Clock,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import logo from '@/assets/logo.png';


const teacherNavItems = [
  { title: 'Dashboard', url: '/teacher', icon: Home },
  { title: 'My Classes', url: '/teacher/classes', icon: BookOpen },
  { title: 'Analytics', url: '/teacher/analytics', icon: BarChart3 },
  { title: 'To Review', url: '/teacher/review', icon: ClipboardList },
  { title: 'Create Class', url: '/teacher/create-class', icon: PlusCircle },
];

const studentNavItems = [
  { title: 'Dashboard', url: '/student', icon: Home },
  { title: 'My Classes', url: '/student/classes', icon: BookOpen },
  { title: 'To Do', url: '/student/todo', icon: CheckSquare },
  { title: 'Upcoming', url: '/student/upcoming', icon: Clock },
];

const adminNavItems = [
  { title: 'Overview', url: '/admin', icon: BarChart3 },
  { title: 'All Courses', url: '/admin/courses', icon: BookOpen },
  { title: 'Create Class', url: '/admin/create-class', icon: PlusCircle },
  { title: 'Teachers', url: '/admin/teachers', icon: GraduationCap },
  { title: 'Students', url: '/admin/students', icon: Users },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
];

export function AppSidebar() {
  const { user, role, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  const navItems = role === 'admin' 
    ? adminNavItems 
    : role === 'teacher' 
      ? teacherNavItems 
      : studentNavItems;

  const roleLabel = role === 'admin' ? 'Administrator' : role === 'teacher' ? 'Teacher' : 'Student';
  const roleColor = role === 'admin' ? 'bg-destructive' : role === 'teacher' ? 'bg-primary' : 'bg-accent';

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="SkillLMS.in" 
            className="h-10 w-10 shrink-0 object-contain"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">SkillLMS.in</span>
              <span className={`text-xs px-2 py-0.5 rounded-full text-white w-fit ${roleColor}`}>
                {roleLabel}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <Separator className="mx-4 w-auto" />

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground uppercase tracking-wider px-2">
            {!collapsed && 'Navigation'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === `/${role}`}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <Separator className="mb-4" />
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={user?.photoUrl} alt={user?.name?.fullName} />
            <AvatarFallback className="bg-secondary text-foreground text-sm">
              {user?.name?.givenName?.[0]}{user?.name?.familyName?.[0]}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.name?.fullName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.emailAddress}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={logout}
              className="shrink-0 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
