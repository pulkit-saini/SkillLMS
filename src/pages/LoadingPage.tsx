import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import logo from '@/assets/logo.png';

interface LoadingPageProps {
  targetRole: string;
}

const LoadingPage = ({ targetRole }: LoadingPageProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 4;

  useEffect(() => {
    // Animate through pages
    const pageInterval = setInterval(() => {
      setCurrentPage((prev) => {
        if (prev >= totalPages - 1) {
          clearInterval(pageInterval);
          // Navigate after animation completes
          setTimeout(() => {
            navigate(`/${targetRole}`);
          }, 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(pageInterval);
  }, [targetRole, navigate]);

  const loadingMessages = [
    "Opening your library...",
    "Gathering your courses...",
    "Preparing your desk...",
    "Almost ready..."
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/50 relative overflow-hidden">
      {/* Background decorations - floating books */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        
        {/* Floating book elements */}
        <div className="absolute top-1/4 left-[10%] animate-float-slow opacity-20">
          <BookOpen className="w-12 h-12 text-primary" />
        </div>
        <div className="absolute top-1/3 right-[15%] animate-float-medium opacity-15">
          <BookOpen className="w-8 h-8 text-primary" />
        </div>
        <div className="absolute bottom-1/4 left-[20%] animate-float-fast opacity-10">
          <BookOpen className="w-10 h-10 text-primary" />
        </div>
        <div className="absolute bottom-1/3 right-[25%] animate-float-slow opacity-20">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo */}
        <img src={logo} alt="SkillLMS.in" className="w-24 h-auto animate-pulse" />

        {/* Book animation container */}
        <div className="relative w-48 h-32 perspective-1000">
          {/* Book base */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary rounded-r-md rounded-l-sm shadow-xl">
            {/* Book spine */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-primary/60 rounded-l-sm" />
            
            {/* Book pages (stacked) */}
            <div className="absolute left-4 top-2 right-2 bottom-2 bg-card rounded-r-sm overflow-hidden">
              {/* Page lines */}
              <div className="p-3 space-y-2">
                <div className="h-1.5 bg-muted rounded w-3/4" />
                <div className="h-1.5 bg-muted rounded w-full" />
                <div className="h-1.5 bg-muted rounded w-5/6" />
                <div className="h-1.5 bg-muted rounded w-2/3" />
                <div className="h-1.5 bg-muted rounded w-4/5" />
              </div>
            </div>
          </div>

          {/* Animated turning pages */}
          {[...Array(totalPages)].map((_, index) => (
            <div
              key={index}
              className={`absolute left-4 top-2 right-2 bottom-2 bg-card rounded-r-sm shadow-md origin-left transition-transform duration-500 ease-in-out ${
                index <= currentPage ? 'page-turned' : ''
              }`}
              style={{
                transform: index <= currentPage 
                  ? 'rotateY(-160deg)' 
                  : `rotateY(${index * -2}deg)`,
                zIndex: totalPages - index,
                transitionDelay: `${index * 100}ms`
              }}
            >
              <div className="p-3 space-y-2 opacity-50">
                <div className="h-1.5 bg-muted rounded w-2/3" />
                <div className="h-1.5 bg-muted rounded w-full" />
                <div className="h-1.5 bg-muted rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading text */}
        <div className="text-center space-y-3">
          <h2 className="text-xl font-semibold text-foreground animate-fade-in">
            {loadingMessages[currentPage]}
          </h2>
          
          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= currentPage 
                    ? 'bg-primary scale-100' 
                    : 'bg-muted scale-75'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground animate-pulse">
          Your learning journey awaits...
        </p>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
