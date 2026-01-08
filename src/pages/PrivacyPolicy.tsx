import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const PrivacyPolicy = () => {
  const effectiveDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="border-border/50">
          <CardHeader className="text-center pb-2">
            <img src={logo} alt="SkillLMS.in Logo" className="w-24 h-auto mx-auto mb-4" />
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Effective Date: {effectiveDate}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none text-foreground space-y-6">
            {/* App Info */}
            <div className="bg-secondary/50 rounded-lg p-4 text-sm">
              <p className="mb-1"><strong>Application Name:</strong> SkillLMS.in</p>
              <p className="mb-1"><strong>Developer:</strong> SkillLMS.in</p>
              <p className="mb-0"><strong>Contact Email:</strong> info@skilllms.in</p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-lg font-semibold mb-3">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to SkillLMS.in ("we," "our," or "us"). We provide a Learning Management System (LMS) 
                dashboard designed to integrate seamlessly with Google Workspace for Education. This Privacy Policy 
                explains how we collect, use, and protect the data of students, teachers, and administrators within 
                your educational institution.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-3">
                By using this Application, you acknowledge that we access and process your Google Classroom™ data 
                to provide dashboard functionalities tailored to your specific role (Student, Teacher, or Administrator).
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-lg font-semibold mb-3">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We access data through the official Google Classroom APIs. The specific data collected depends on 
                your role within the institution:
              </p>

              <h3 className="text-base font-medium mb-2">A. For All Users (Students, Teachers, & Admins)</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li><strong>Profile Information:</strong> Full name, email address (.edu or organizational email), and profile photo.</li>
                <li><strong>Authentication Data:</strong> Secure OAuth 2.0 tokens used to maintain your login session.</li>
              </ul>

              <h3 className="text-base font-medium mb-2">B. For Students</h3>
              <p className="text-muted-foreground mb-2">We access the following to generate the Student Dashboard:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li><strong>Enrollment Data:</strong> List of courses you are enrolled in.</li>
                <li><strong>Coursework:</strong> Assignment titles, descriptions, due dates, and attached materials (Drive files, links).</li>
                <li><strong>Submission Status:</strong> Whether work is "Turned In," "Missing," or "Graded," including grades and feedback provided by teachers.</li>
                <li><strong>Attachments:</strong> Files or links submitted as part of your assignments.</li>
              </ul>

              <h3 className="text-base font-medium mb-2">C. For Teachers</h3>
              <p className="text-muted-foreground mb-2">We access the following to generate the Teacher Dashboard:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1 mb-4">
                <li><strong>Course Management:</strong> Details of courses you teach (Subject, Room, Section).</li>
                <li><strong>Rosters:</strong> Names and email addresses of all students enrolled in your classes.</li>
                <li><strong>Gradebook Data:</strong> Student submissions, grades, private comments, and return status.</li>
                <li><strong>Coursework Creation:</strong> Data related to new assignments, announcements, or materials you create through our platform.</li>
              </ul>

              <h3 className="text-base font-medium mb-2">D. For Administrators</h3>
              <p className="text-muted-foreground mb-2">We access the following to generate the Admin/Principal Dashboard:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Domain-Wide Course Lists:</strong> Metadata for all active and archived courses within the institution's Google domain.</li>
                <li><strong>User Directory:</strong> Lists of teachers and students to generate aggregate reports (e.g., "Total Active Students," "Total Courses").</li>
                <li><strong>Usage Statistics:</strong> Aggregate data on coursework volume and assignment completion rates across the school.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-lg font-semibold mb-3">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>We do not sell user data.</strong> All data accessed is used strictly for the functionality of the LMS:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Role-Based Access Control:</strong> To automatically verify if a user is a Verified Teacher, Student, or Administrator to display the correct interface.</li>
                <li><strong>Academic Management:</strong> To allow teachers to create, grade, and return assignments, and to allow students to view and submit work.</li>
                <li><strong>Institutional Oversight:</strong> To provide School Administrators with a high-level view of classroom adoption and activity.</li>
                <li><strong>Sync & Persistence:</strong> To ensure that changes made on our dashboard (e.g., grading an assignment) are instantly reflected in your official Google Classroom account.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-lg font-semibold mb-3">4. Google User Data Policy (Limited Use)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Our use and transfer of information received from Google APIs to any other app will adhere to the{" "}
                <a 
                  href="https://developers.google.com/terms/api-services-user-data-policy" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google API Services User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>No Surveillance:</strong> We do not use Google Workspace data for surveillance or advertising.</li>
                <li><strong>No Third-Party Sharing:</strong> We do not share your educational records with third parties unless explicitly required by the educational institution or by law.</li>
                <li><strong>No AI Training:</strong> We do not use your personal Classroom content to train generalized Artificial Intelligence (AI) models.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-lg font-semibold mb-3">5. Data Retention</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Session Data:</strong> We store authentication tokens locally in your browser to keep you logged in. These are cleared upon logout.</li>
                <li><strong>Cached Data:</strong> We may temporarily cache course lists or assignment details to improve the speed of the dashboard.</li>
                <li><strong>No Permanent Storage:</strong> We function primarily as a specific "viewer" and "editor" for your Google Classroom data. The "source of truth" remains your Google Drive and Google Classroom account. We do not permanently archive student submissions or grades on our own external servers.</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-lg font-semibold mb-3">6. Security Measures</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>Encryption:</strong> All data transmitted between your browser, our application, and Google's servers is encrypted using TLS/SSL (HTTPS).</li>
                <li><strong>OAuth 2.0:</strong> We never see or store your Google Account password. Access is granted via secure tokens which you can revoke at any time.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-lg font-semibold mb-3">7. Your Rights (FERPA & COPPA)</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you are accessing this application through a K-12 school in the United States:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong>FERPA:</strong> We act as a "School Official" with a legitimate educational interest in processing student education records.</li>
                <li><strong>Revocation:</strong> Parents or eligible students may request the deletion of data or revocation of access by contacting their School Administrator or managing their Google Account permissions.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-lg font-semibold mb-3">8. Contact & Support</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                If you have questions about this policy or the data we process for your institution, please contact us:
              </p>
              <div className="bg-secondary/50 rounded-lg p-4 text-sm">
                <p className="mb-1"><strong>Support Email:</strong> info@skilllms.in</p>
                <p className="mb-0"><strong>Developer Address:</strong> Noida, UP</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
