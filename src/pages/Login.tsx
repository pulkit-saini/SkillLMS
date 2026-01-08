import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { classroomService } from "@/services/classroomService";
import logo from "@/assets/logo.png";
import { Navbar } from "@/components/landing/Navbar";
import LoadingPage from "./LoadingPage";

const ADMIN_EMAILS = ['principal@school.edu', 'admin@school.edu', 'pulkit@mangosorange.com', 'mentor.ravi.db@gmail.com'];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDetectingRole, setIsDetectingRole] = useState(false);
  const [detectedRole, setDetectedRole] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      // Parse token from URL hash (redirect flow)
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        if (accessToken) {
          localStorage.setItem("google_access_token", accessToken);
          window.history.replaceState({}, document.title, window.location.pathname);
          await detectRoleAndRedirect(accessToken);
          return;
        }
      }

      // Check if we already have a token
      const token = localStorage.getItem("google_access_token");
      if (token) {
        await detectRoleAndRedirect(token);
      }
    };

    initAuth();
  }, [navigate, location]);

  const detectRoleAndRedirect = async (token: string) => {
    setIsDetectingRole(true);
    try {
      const role = await classroomService.detectUserRole(token, ADMIN_EMAILS);
      localStorage.setItem("user_role", role);
      setDetectedRole(role);
      // The LoadingPage component will handle the navigation
    } catch (error) {
      toast.error("Failed to detect role, defaulting to student");
      setDetectedRole("student");
    }
  };

  const handleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Force https on real domains to avoid OAuth redirect_uri_mismatch when a browser opens http://
    const redirectOrigin = (() => {
      const { protocol, hostname, origin } = window.location;
      if (protocol === "http:" && hostname !== "localhost" && hostname !== "127.0.0.1") {
        return origin.replace("http://", "https://");
      }
      return origin;
    })();

    const redirectUri = `${redirectOrigin}/login`;

    const scope = encodeURIComponent(
      "openid email profile https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.profile.emails https://www.googleapis.com/auth/classroom.student-submissions.me.readonly https://www.googleapis.com/auth/classroom.student-submissions.students.readonly https://www.googleapis.com/auth/classroom.announcements.readonly https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly https://www.googleapis.com/auth/drive.file"
    );

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&scope=${scope}&prompt=consent`;

    window.location.href = authUrl;
  };

  // Show loading page when role is detected
  if (detectedRole) {
    return <LoadingPage targetRole={detectedRole} />;
  }

  // Show simple loading while detecting role
  if (isDetectingRole) {
    return <LoadingPage targetRole="student" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50 p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

   
      {/* Navbar */}
      <div className="absolute top-0 left-0 right-0">
        <Navbar />
      </div>
      <div className="relative w-full max-w-md animate-scale-in">
        <div className="bg-card rounded-2xl shadow-card border border-border/50 p-8 backdrop-blur-sm">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <img src={logo} alt="SkillLMS.in Logo" className="w-32 h-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              SkillLMS.in
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to access your courses and assignments
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <span>View your enrolled courses</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <span>Access your coursework and assignments</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button
            onClick={handleLogin}
            className="w-full h-12 bg-card hover:bg-secondary border border-border text-foreground font-medium rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
             
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-6">
            By signing in, you agree to grant access to your classroom data
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Link 
              to="/privacy" 
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              to="/terms" 
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
