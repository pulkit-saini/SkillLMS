import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Book, HelpCircle, ChevronDown, ChevronUp, ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
const faqs = [{
  category: 'Getting Started',
  questions: [{
    q: 'How do I create my first course?',
    a: 'Navigate to your Teacher Dashboard, click "Create Class" and follow the step-by-step wizard. You can add course materials, set up assignments, and invite students.'
  }, {
    q: 'How do I invite students to my class?',
    a: 'Go to your class, click on "People" tab, then use the "Invite Students" button. You can invite via email or share a class code.'
  }, {
    q: 'What file formats are supported for materials?',
    a: 'We support PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, images (PNG, JPG, GIF), and video files (MP4, WebM). Maximum file size is 100MB.'
  }]
}, {
  category: 'Account & Billing',
  questions: [{
    q: 'How do I reset my password?',
    a: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your inbox.'
  }, {
    q: 'Can I upgrade my plan at any time?',
    a: 'Yes! You can upgrade from your Account Settings. The new plan takes effect immediately, and we prorate the charges.'
  }, {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit/debit cards, UPI, net banking, and for enterprise plans, we also support bank transfers.'
  }]
}, {
  category: 'Technical Support',
  questions: [{
    q: 'The platform is running slow. What should I do?',
    a: 'Try clearing your browser cache, disable extensions, or try a different browser. If issues persist, contact support with your browser details.'
  }, {
    q: 'How do I integrate with Google Classroom?',
    a: 'Go to Settings > Integrations > Google Classroom. Click "Connect" and authorize access. Your classes will sync automatically.'
  }, {
    q: 'Is my data backed up?',
    a: 'Yes, we perform automatic daily backups. Your data is stored securely with 99.99% durability across multiple data centers.'
  }]
}];
const resources = [{
  icon: Book,
  title: 'Documentation',
  description: 'Comprehensive guides and tutorials',
  link: '/docs'
}, {
  icon: MessageCircle,
  title: 'Community Forum',
  description: 'Connect with other educators',
  link: '/community'
}, {
  icon: HelpCircle,
  title: 'Video Tutorials',
  description: 'Step-by-step video guides',
  link: '/tutorials'
}];
export default function HelpDesk() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            
            <h1 className="text-4xl font-bold text-foreground mb-4">How can we help you?</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Search our knowledge base or browse FAQs below. Can't find what you need? Contact our support team.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input type="text" placeholder="Search for answers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-14 text-lg bg-card border-border/50" />
          </div>

          {/* Quick Resources */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {resources.map(resource => <Link key={resource.title} to={resource.link}>
                <Card className="bg-card border-border/50 hover:border-primary/30 hover:shadow-lg transition-all h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <resource.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              </Link>)}
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-8">
              {faqs.map(category => <div key={category.category}>
                  <h3 className="text-lg font-semibold text-foreground mb-4">{category.category}</h3>
                  <div className="space-y-3">
                    {category.questions.map((faq, idx) => {
                  const faqId = `${category.category}-${idx}`;
                  const isOpen = openFaq === faqId;
                  return <div key={faqId} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                          <button onClick={() => toggleFaq(faqId)} className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors">
                            <span className="font-medium text-foreground">{faq.q}</span>
                            {isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />}
                          </button>
                          {isOpen && <div className="px-4 pb-4">
                              <p className="text-muted-foreground">{faq.a}</p>
                            </div>}
                        </div>;
                })}
                  </div>
                </div>)}
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-primary-foreground mb-4">Still need help?</h3>
            <p className="text-primary-foreground/80 mb-6">
              Our support team is available 24/7 to assist you with any questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@skilllms.in">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </Button>
              </a>
              <a href="tel:+911204164821">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
}