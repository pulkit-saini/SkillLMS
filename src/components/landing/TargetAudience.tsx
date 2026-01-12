import { School, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const audiences = [
  {
    icon: School,
    title: 'Schools & K-12',
    description: 'Streamline classroom management, parent communication, and student progress tracking for primary and secondary education.',
    benefits: [
      'Centralized student records',
      'Parent-teacher communication portal',
      'Homework and grade tracking',
      'Attendance automation'
    ],
    color: 'primary'
  },
  {
    icon: GraduationCap,
    title: 'Coaching Institutes',
    description: 'Manage multiple batches, track test performance, and deliver competitive exam preparation at scale.',
    benefits: [
      'Batch management system',
      'Test series with analytics',
      'Performance benchmarking',
      'Study material distribution'
    ],
    color: 'accent'
  },
  {
    icon: Briefcase,
    title: 'EdTech & Investors',
    description: 'A scalable, white-label platform with comprehensive APIs and analytics for EdTech ventures and investment portfolios.',
    benefits: [
      'White-label customization',
      'API-first architecture',
      'Investor-ready dashboards',
      'Multi-tenant support'
    ],
    color: 'primary'
  },
];

export function TargetAudience() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built for Every Educational Institution
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're running a school, coaching center, or building the next EdTech unicorn, 
            SkillLMS.in adapts to your unique needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {audiences.map((audience) => (
            <div 
              key={audience.title}
              className="bg-card border border-border/50 rounded-2xl p-8 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 flex flex-col"
            >
              <div className={`w-14 h-14 rounded-2xl ${audience.color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'} flex items-center justify-center mb-6`}>
                <audience.icon className={`h-7 w-7 ${audience.color === 'accent' ? 'text-accent' : 'text-primary'}`} />
              </div>
              
              <h3 className="text-xl font-bold text-foreground mb-3">{audience.title}</h3>
              <p className="text-muted-foreground mb-6">{audience.description}</p>
              
              <div className="space-y-3 mb-8 flex-1">
                {audience.benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className={`w-1.5 h-1.5 rounded-full ${audience.color === 'accent' ? 'bg-accent' : 'bg-primary'}`} />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/login">
                <Button variant="outline" className="w-full group">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="mt-20 bg-gradient-to-r from-primary to-accent rounded-3xl p-10 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-8">
            Making an Impact in Education
          </h3>
          <div className="grid sm:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Institutions' },
              { value: '50K+', label: 'Students' },
              { value: '2M+', label: 'Lessons Delivered' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
