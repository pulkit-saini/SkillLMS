import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Shield, 
  Zap, 
  Globe,
  GraduationCap,
  ClipboardCheck,
  Bell,
  Calendar,
  FileText,
  Settings
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const teacherFeatures = [
  {
    icon: BookOpen,
    title: 'Course Management',
    description: 'Create, organize, and manage courses with intuitive drag-and-drop tools.'
  },
  {
    icon: ClipboardCheck,
    title: 'Assignment & Grading',
    description: 'Streamlined assignment creation with automated grading capabilities.'
  },
  {
    icon: Users,
    title: 'Student Enrollment',
    description: 'Bulk import, invite, and manage student enrollments effortlessly.'
  },
  {
    icon: Bell,
    title: 'Announcements',
    description: 'Keep everyone informed with targeted announcements and notifications.'
  },
  {
    icon: Calendar,
    title: 'Schedule Management',
    description: 'Integrated calendar for classes, deadlines, and important events.'
  },
  {
    icon: Settings,
    title: 'Role-Based Access',
    description: 'Granular permissions for admins, teachers, and teaching assistants.'
  },
];

const studentFeatures = [
  {
    icon: GraduationCap,
    title: 'Personalized Dashboard',
    description: 'See all your courses, upcoming deadlines, and progress at a glance.'
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Visual progress indicators and performance analytics for each course.'
  },
  {
    icon: FileText,
    title: 'Easy Submissions',
    description: 'Submit assignments with drag-and-drop, supporting multiple file formats.'
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get immediate feedback on quizzes and automated assessments.'
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Manage Education
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From course creation to student analytics, our platform provides comprehensive 
            tools for modern educational institutions.
          </p>
        </div>

        {/* Teacher & Admin Features */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Teacher & Admin Tools</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherFeatures.map((feature) => (
              <Card 
                key={feature.title} 
                className="bg-card border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Student Features */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Student Experience</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentFeatures.map((feature) => (
              <Card 
                key={feature.title} 
                className="bg-card border-border/50 hover:border-accent/30 hover:shadow-lg transition-all duration-300 group"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Platform Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Globe,
              title: 'Cloud-Based',
              description: 'Access from anywhere, anytime. No installations required.'
            },
            {
              icon: Shield,
              title: 'Enterprise Security',
              description: 'Bank-grade encryption and data protection standards.'
            },
            {
              icon: Zap,
              title: 'Lightning Fast',
              description: 'Optimized for speed with global CDN delivery.'
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-lg font-semibold text-foreground mb-2">{item.title}</h4>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
