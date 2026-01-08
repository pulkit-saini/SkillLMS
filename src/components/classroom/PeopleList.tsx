import { Teacher, Student } from "@/services/classroomService";
import { Users, GraduationCap, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PeopleListProps {
  teachers: Teacher[];
  students: Student[];
  loading: boolean;
}

export const PeopleList = ({ teachers, students, loading }: PeopleListProps) => {
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
          Classmates ({students.length})
        </h3>
        
        {students.length === 0 ? (
          <p className="text-muted-foreground text-sm">No classmate information available.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <PersonCard key={student.userId} person={student} role="Student" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PersonCard = ({ person, role }: { person: Teacher | Student; role: string }) => {
  const profile = person.profile;
  const name = profile?.name?.fullName || 'Unknown';
  const initials = profile?.name ? 
    `${profile.name.givenName?.[0] || ''}${profile.name.familyName?.[0] || ''}` : 
    '?';

  return (
    <div className="flex items-center gap-3 p-4 bg-card rounded-xl border border-border/50 hover:shadow-sm transition-all">
      <Avatar className="w-10 h-10">
        <AvatarImage src={profile?.photoUrl} alt={name} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">{name}</p>
        {profile?.emailAddress && (
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {profile.emailAddress}
          </p>
        )}
      </div>
    </div>
  );
};
