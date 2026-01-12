import { Teacher, Student } from "@/services/classroomService";
import { Users, GraduationCap, Mail, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface PeopleListProps {
  teachers: Teacher[];
  students: Student[];
  loading: boolean;
}

export const PeopleList = ({ teachers, students, loading }: PeopleListProps) => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const isAdmin = role === 'admin';

  const handleStudentClick = (studentId: string) => {
    if (isAdmin) {
      navigate(`/admin/student/${studentId}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-xl border animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Teachers Section */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          Teachers ({teachers.length})
        </h3>
        
        {teachers.length === 0 ? (
          <p className="text-muted-foreground text-sm">No teacher information available.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {teachers.map((teacher) => (
              <PersonCard key={teacher.userId} person={teacher} role="Teacher" />
            ))}
          </div>
        )}
      </div>

      {/* Students Section */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold mb-4">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Users className="w-4 h-4 text-accent" />
          </div>
          Students ({students.length})
        </h3>
        
        {students.length === 0 ? (
          <p className="text-muted-foreground text-sm">No student information available.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <PersonCard 
                key={student.userId} 
                person={student} 
                role="Student" 
                onClick={isAdmin ? () => handleStudentClick(student.userId) : undefined}
                isClickable={isAdmin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface PersonCardProps {
  person: Teacher | Student;
  role: string;
  onClick?: () => void;
  isClickable?: boolean;
}

const PersonCard = ({ person, role, onClick, isClickable }: PersonCardProps) => {
  const profile = person.profile;
  const email = profile?.emailAddress;
  
  // Better name fallback: fullName > email username > userId
  const name = profile?.name?.fullName 
    || (email ? email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : null)
    || `User ${person.userId.slice(-6)}`;
  
  // Generate initials from whatever name we have
  const getInitials = (displayName: string): string => {
    const parts = displayName.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return displayName.slice(0, 2).toUpperCase();
  };
  
  const initials = profile?.name 
    ? `${profile.name.givenName?.[0] || ''}${profile.name.familyName?.[0] || ''}` 
    : getInitials(name);

  return (
    <div 
      className={`flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 transition-all ${
        isClickable 
          ? 'hover:shadow-md hover:border-primary/30 cursor-pointer group' 
          : 'hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={profile?.photoUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate flex items-center gap-1">
          {name}
          {isClickable && (
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
          )}
        </p>
        {email && (
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {email}
          </p>
        )}
      </div>
    </div>
  );
};
