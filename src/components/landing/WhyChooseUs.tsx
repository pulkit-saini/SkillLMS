import { CheckCircle, Building2, TrendingUp, Shield, Users, Zap } from 'lucide-react';
const benefits = [{
  icon: Building2,
  title: 'Scalable Architecture',
  description: 'From 100 to 100,000 students. Our infrastructure grows with your institution without performance drops.',
  stats: '99.9% Uptime'
}, {
  icon: TrendingUp,
  title: 'Data-Driven Ecosystem',
  description: 'Make informed decisions with comprehensive analytics on student performance, engagement, and outcomes.',
  stats: '50+ Metrics'
}, {
  icon: Shield,
  title: 'Enterprise Security',
  description: 'SOC 2 compliant with end-to-end encryption. Your data is protected by industry-leading security measures.',
  stats: 'ISO 27001'
}, {
  icon: Users,
  title: 'Dedicated Support',
  description: '24/7 technical support with dedicated account managers for enterprise clients.',
  stats: '< 2hr Response'
}];
const checkpoints = ['Real-time student progress monitoring', 'Automated attendance tracking', 'Custom branding for your institution', 'Integration with existing tools', 'Mobile-responsive design', 'Multi-language support'];
export function WhyChooseUs() {
  return <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Zap className="h-4 w-4" />
              Why SkillLMS
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Built for Modern Education at Scale
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We've designed SkillLMS.in from the ground up to meet the demands of today's 
              educational institutions. Whether you're a coaching center or a university, 
              we've got you covered.
            </p>

            {/* Checkpoints */}
            <div className="grid sm:grid-cols-2 gap-4">
              {checkpoints.map(point => <div key={point} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </div>)}
            </div>
          </div>

          {/* Right Content - Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map(benefit => <div key={benefit.title} className="bg-card border border-border/50 rounded-2xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-xs font-semibold text-primary mb-2">{benefit.stats}</div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>)}
          </div>
        </div>

        {/* Trust Logos */}
        
      </div>
    </section>;
}