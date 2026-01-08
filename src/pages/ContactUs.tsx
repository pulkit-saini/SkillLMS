import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, ArrowLeft, Building, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { useToast } from '@/hooks/use-toast';
export default function ContactUs() {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    type: '',
    message: ''
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours."
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      organization: '',
      type: '',
      message: ''
    });
    setIsSubmitting(false);
  };
  const contactInfo = [{
    icon: Mail,
    title: 'Email Us',
    details: 'support@skilllms.in',
    subtext: 'For general inquiries'
  }, {
    icon: Phone,
    title: 'Call Us',
    details: '+91 12041 64821',
    subtext: 'Mon-Fri, 9:30AM-6:30PM IST'
  }, {
    icon: MapPin,
    title: 'Visit Us',
    details: 'G-282, G Block, 1st Floor, Noida 62, India',
    subtext: 'By appointment only'
  }];
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            
            <h1 className="text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Have questions about SkillLMS.in? We'd love to hear from you. 
              Fill out the form below or reach out directly.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map(info => <Card key={info.title} className="bg-card border-border/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                        <p className="text-foreground">{info.details}</p>
                        <p className="text-sm text-muted-foreground">{info.subtext}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>)}

              {/* Additional Info */}
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Response Time</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    We typically respond within 24 hours during business days. 
                    For urgent matters, please call us directly.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-card border-border/50">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Send us a message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" placeholder="John Doe" value={formData.name} onChange={e => setFormData({
                        ...formData,
                        name: e.target.value
                      })} required className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({
                        ...formData,
                        email: e.target.value
                      })} required className="bg-background" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={e => setFormData({
                        ...formData,
                        phone: e.target.value
                      })} className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Organization</Label>
                        <Input id="organization" placeholder="Your School/Institute" value={formData.organization} onChange={e => setFormData({
                        ...formData,
                        organization: e.target.value
                      })} className="bg-background" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Inquiry Type *</Label>
                      <Select value={formData.type} onValueChange={value => setFormData({
                      ...formData,
                      type: value
                    })} required>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="demo">Request a Demo</SelectItem>
                          <SelectItem value="pricing">Pricing Information</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" placeholder="Tell us how we can help you..." value={formData.message} onChange={e => setFormData({
                      ...formData,
                      message: e.target.value
                    })} required rows={5} className="bg-background resize-none" />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending...' : <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>;
}