import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="text-center pb-6 border-b border-border/50">
            <img src={logo} alt="SkillLMS.in Logo" className="w-24 h-auto mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Effective Date: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          
          <CardContent className="prose prose-sm sm:prose-base max-w-none text-foreground pt-8 space-y-8">
            
            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using <strong>SkillLMS.in</strong> (the "Service"), you agree to be bound by these Terms of Service ("Terms"). 
                If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-2">
                If you are accessing the Service on behalf of an educational institution (e.g., as a School Administrator or Teacher), 
                you represent that you have the authority to bind that institution to these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                SkillLMS.in is a Learning Management System (LMS) dashboard that integrates with <strong>Google Workspace for Education</strong>. 
                The Service provides specialized interfaces for different user roles:
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-2">
                <li><strong>Students:</strong> To view assignments, submit coursework, and track due dates.</li>
                <li><strong>Teachers:</strong> To manage rosters, create assignments, grade submissions, and view class analytics.</li>
                <li><strong>Administrators:</strong> To oversee domain-wide course activity and user statistics.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                The Service relies on the <strong>Google Classroom API</strong> to function. We do not host the primary data; we act as a specialized interface for the data hosted in your Google Classroom account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">3. User Roles and Responsibilities</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-foreground">A. Students</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-1 ml-2">
                    <li>You agree to submit only your own original work.</li>
                    <li>You are responsible for ensuring your assignments are submitted before the due dates.</li>
                    <li>You must not attempt to access the Teacher or Admin dashboards.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground">B. Teachers</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-1 ml-2">
                    <li>You are responsible for the accuracy of the grades and feedback provided.</li>
                    <li>You represent that you have appropriate permissions to manage student data.</li>
                    <li>You must not use Roster data for any purpose other than educational management.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-foreground">C. Administrators</h3>
                  <ul className="list-disc list-inside text-muted-foreground mt-1 ml-2">
                    <li>You are responsible for managing user access within your Google Workspace domain.</li>
                    <li>You agree that Classroom Portal is a tool for oversight and not a replacement for official academic record-keeping systems (SIS).</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">4. Google Classroom Integration</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of the Service is also subject to your compliance with Google's policies.
              </p>
              <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-2">
                <li><strong>Authorization:</strong> You grant the Service permission to access your Google Classroom data (courses, rosters, coursework) via OAuth 2.0.</li>
                <li><strong>Revocation:</strong> You may revoke this permission at any time via your Google Account security settings.</li>
                <li><strong>Service Availability:</strong> We are not responsible for interruptions caused by Google Classroom downtime or API changes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">5. Acceptable Use Policy</h2>
              <p className="text-muted-foreground mb-2">You agree <strong>not</strong> to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li>Use the Service to transmit any content that is unlawful, harmful, threatening, or abusive.</li>
                <li>Attempt to reverse engineer, decompile, or hack the Service.</li>
                <li>Use the Service to cheat, plagiarize, or facilitate academic dishonesty.</li>
                <li>Scrape or mass-export data from the Service for commercial purposes.</li>
                <li>Impersonate another user or attempt to mask your identity.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">6. Intellectual Property</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                <li><strong>Your Content:</strong> You retain full ownership of the assignments, materials, and grades you submit ("User Content"). We claim no ownership over your educational data.</li>
                <li><strong>Our Service:</strong> The interface, code, graphics, and design of Classroom Portal are the property of Skilllms.in and are protected by copyright laws.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">7. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed uppercase text-xs tracking-wide">
                The service is provided "as is" and "as available" without warranties of any kind, either express or implied. 
                We do not guarantee that the service will be uninterrupted, error-free, or secure. We disclaim all warranties of merchantability and fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed uppercase text-xs tracking-wide">
                To the fullest extent permitted by law, Skilllms.in shall not be liable for any indirect, incidental, special, or consequential damages, 
                including loss of data, academic records, or profits, arising out of your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3 text-foreground">9. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-secondary/20 rounded-lg text-sm">
                <p><strong>Email:</strong> info@skilllms.in</p>
                <p className="mb-1"><strong>Developer:</strong> SkillLMS.in</p>
                <p><strong>Address:</strong> G-282, G Block, 1st Floor, Sector 63, Noida, UP</p>
              </div>
            </section>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
