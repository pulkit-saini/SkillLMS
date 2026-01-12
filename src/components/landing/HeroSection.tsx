import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Users, BookOpen, School, GraduationCap, Library, Building2 } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              The Complete{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Learning Management
              </span>{' '}
              System
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Create, manage, and deliver courses with ease. Empower teachers, engage students, 
              and track progress—all from one powerful platform built for modern education.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12 text-base">
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-12 text-base font-semibold"
                >
                  Contact Us
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 mt-12 justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[School, GraduationCap, Library, Building2].map((Icon, i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background flex items-center justify-center"
                    >
                      <Icon className="h-4 w-4 text-primary-foreground" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">500+ Schools</span>
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">10K+</span> Courses
              </div>
              <div className="h-8 w-px bg-border hidden sm:block" />
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">50K+</span> Students
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="relative bg-card rounded-2xl shadow-2xl border border-border/50 p-6 transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
              {/* Mini Dashboard Preview */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 h-6 bg-muted rounded-md" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Users, label: 'Students', value: '12,847' },
                  { icon: BookOpen, label: 'Courses', value: '234' },
                  { icon: BarChart3, label: 'Completion', value: '89%' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-muted/50 rounded-xl p-4 text-center">
                    <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Chart Placeholder */}
              <div className="h-40 bg-gradient-to-t from-primary/20 to-transparent rounded-xl flex items-end justify-around p-4">
                {[65, 80, 45, 90, 55, 75, 85].map((height, i) => (
                  <div
                    key={i}
                    className="w-6 bg-gradient-to-t from-primary to-accent rounded-t-md transition-all duration-300 hover:opacity-80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-card rounded-xl shadow-lg border border-border/50 p-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">+23%</div>
                  <div className="text-xs text-muted-foreground">Performance</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-card rounded-xl shadow-lg border border-border/50 p-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Active Now</div>
                  <div className="text-xs text-muted-foreground">2,847 users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
