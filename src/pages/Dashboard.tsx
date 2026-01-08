import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, 
  GraduationCap, 
  BookOpen, 
  Megaphone, 
  FolderOpen, 
  Users,
  Loader2,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  classroomService, 
  Course, 
  CourseWork, 
  Announcement, 
  CourseMaterial,
  Teacher,
  Student 
} from "@/services/classroomService";
import { CourseCard } from "@/components/classroom/CourseCard";
import { AssignmentCard } from "@/components/classroom/AssignmentCard";
import { AnnouncementsList } from "@/components/classroom/AnnouncementsList";
import { MaterialsList } from "@/components/classroom/MaterialsList";
import { PeopleList } from "@/components/classroom/PeopleList";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("google_access_token");

  // Course state
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  // Tab content state
  const [assignments, setAssignments] = useState<CourseWork[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  // Loading states
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);

  // User role state
  const [userRole, setUserRole] = useState<'teacher' | 'student' | 'unknown'>('unknown');
  const [loadingRole, setLoadingRole] = useState(false);

  const [activeTab, setActiveTab] = useState("assignments");

  const currentCourse = courses.find(c => c.id === selectedCourseId);

  // Auth check and fetch courses
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchCourses = async () => {
      try {
        const data = await classroomService.getCourses(token);
        const activeCourses = data.filter((c: Course) => c.courseState === 'ACTIVE' || !c.courseState);
        setCourses(activeCourses);
        
        if (activeCourses.length > 0) {
          setSelectedCourseId(activeCourses[0].id);
        }
       } catch (error: any) {
         const status = error?.response?.status;
         const apiMessage: string | undefined = error?.response?.data?.error?.message;

         console.error("Failed to load courses", error?.response?.data ?? error);

         if (status === 401) {
           handleLogout();
         } else if (status === 403) {
           const msg = apiMessage ?? "Access denied by Google Classroom (403)";
           setCoursesError(msg);
           toast.error("Google Classroom access denied. Check API + OAuth scopes.");
         } else {
           toast.error("Failed to load courses. Please try again.");
         }
       } finally {
         setLoadingCourses(false);
       }
    };

    fetchCourses();
  }, [token, navigate]);

  // Fetch course content when course or tab changes
  useEffect(() => {
    if (!selectedCourseId || !token) return;

    const fetchContent = async () => {
      switch (activeTab) {
        case "assignments":
          await fetchAssignments();
          break;
        case "announcements":
          await fetchAnnouncements();
          break;
        case "materials":
          await fetchMaterials();
          break;
        case "people":
          await fetchPeople();
          break;
      }
    };

    fetchContent();
  }, [selectedCourseId, activeTab, token]);

  // Fetch user role when course changes
  useEffect(() => {
    if (!selectedCourseId || !token) return;

    const fetchUserRole = async () => {
      setLoadingRole(true);
      try {
        const role = await classroomService.getUserRoleInCourse(token, selectedCourseId);
        setUserRole(role);
        console.log(`User role in course ${selectedCourseId}: ${role}`);
      } catch (error: any) {
        console.error("Failed to get user role:", error.message);
        setUserRole('unknown');
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, [selectedCourseId, token]);

  const fetchAssignments = async () => {
    if (!token || !selectedCourseId) return;
    setLoadingAssignments(true);
    try {
      const workData = await classroomService.getCourseWork(token, selectedCourseId);
      
      const detailedWork = await Promise.all(
        workData.map(async (work: CourseWork) => {
          const submission = await classroomService.getSubmission(token, selectedCourseId, work.id);
          return { ...work, submission };
        })
      );
      setAssignments(detailedWork);
    } catch (error: any) {
      console.error("Failed to load assignments:", error.message);
      toast.error(`Assignments error: ${error.message}`);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const fetchAnnouncements = async () => {
    if (!token || !selectedCourseId) return;
    setLoadingAnnouncements(true);
    try {
      const data = await classroomService.getAnnouncements(token, selectedCourseId);
      setAnnouncements(data);
    } catch (error: any) {
      console.error("Failed to load announcements:", error.message);
      toast.error(`Announcements error: ${error.message}`);
    } finally {
      setLoadingAnnouncements(false);
    }
  };

  const fetchMaterials = async () => {
    if (!token || !selectedCourseId) return;
    setLoadingMaterials(true);
    try {
      const data = await classroomService.getCourseMaterials(token, selectedCourseId);
      setMaterials(data);
    } catch (error: any) {
      console.error("Failed to load materials:", error.message);
      toast.error(`Materials error: ${error.message}`);
    } finally {
      setLoadingMaterials(false);
    }
  };

  const fetchPeople = async () => {
    if (!token || !selectedCourseId) return;
    setLoadingPeople(true);
    try {
      const [teachersData, studentsData] = await Promise.all([
        classroomService.getTeachers(token, selectedCourseId),
        classroomService.getStudents(token, selectedCourseId)
      ]);
      setTeachers(teachersData);
      setStudents(studentsData);
    } catch (error: any) {
      console.error("Failed to load people:", error.message);
      toast.error(`People error: ${error.message}`);
    } finally {
      setLoadingPeople(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("google_access_token");
    navigate("/");
  };

  const handleAddLink = async (assignment: CourseWork) => {
    const link = prompt("Paste your project URL here:");
    if (!link || !selectedCourseId || !assignment.submission) return;

    try {
      await classroomService.addLink(token!, selectedCourseId, assignment.id, assignment.submission.id, link);
      toast.success("Link attached successfully!");
      fetchAssignments();
    } catch (error: any) {
      console.error("Add link error:", error.message);
      toast.error(`Add link failed: ${error.message}`);
    }
  };

  const handleTurnIn = async (assignment: CourseWork) => {
    if (!selectedCourseId || !assignment.submission) return;
    const confirm = window.confirm(`Ready to submit "${assignment.title}"?`);
    if (!confirm) return;

    try {
      await classroomService.turnIn(token!, selectedCourseId, assignment.id, assignment.submission.id);
      toast.success("Assignment turned in!");
      fetchAssignments();
    } catch (error: any) {
      console.error("Turn in error:", error.message);
      toast.error(`Turn in failed: ${error.message}`);
    }
  };

  const handleReclaim = async (assignment: CourseWork) => {
    if (!selectedCourseId || !assignment.submission) return;
    const confirm = window.confirm(`Unsubmit "${assignment.title}"?`);
    if (!confirm) return;

    try {
      await classroomService.reclaim(token!, selectedCourseId, assignment.id, assignment.submission.id);
      toast.success("Assignment unsubmitted!");
      fetchAssignments();
    } catch (error: any) {
      console.error("Reclaim error:", error.message);
      toast.error(`Unsubmit failed: ${error.message}`);
    }
  };

  const handleRefresh = () => {
    switch (activeTab) {
      case "assignments":
        fetchAssignments();
        break;
      case "announcements":
        fetchAnnouncements();
        break;
      case "materials":
        fetchMaterials();
        break;
      case "people":
        fetchPeople();
        break;
    }
    toast.success("Content refreshed!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Classroom Portal</span>
              
              {/* User Role Badge for debugging */}
              {selectedCourseId && (
                <Badge 
                  variant={userRole === 'teacher' ? 'default' : userRole === 'student' ? 'secondary' : 'outline'}
                  className="ml-2"
                >
                  {loadingRole ? 'Loading...' : `Role: ${userRole.toUpperCase()}`}
                </Badge>
              )}
            </div>
            <Button onClick={handleLogout} variant="ghost" className="gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading state for courses */}
        {loadingCourses ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading your classes...</p>
          </div>
        ) : coursesError ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <h1 className="text-xl font-semibold mb-2">Google Classroom access denied</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              {coursesError}
            </p>
            <div className="max-w-2xl mx-auto text-left text-sm text-muted-foreground bg-secondary/40 rounded-lg border border-border p-4">
              <p className="font-medium text-foreground mb-2">Fix checklist</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Use your own Google OAuth Client ID in <code>src/App.tsx</code> (not a sample ID).</li>
                <li>In Google Cloud Console, enable <strong>Google Classroom API</strong> for that project.</li>
                <li>OAuth consent screen: add the Classroom scopes requested by this app.</li>
                <li>If your app is in <strong>Testing</strong>, add your Google account as a <strong>Test user</strong>.</li>
              </ul>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={handleLogout}>Sign in again</Button>
              <Button onClick={() => window.open("https://console.cloud.google.com/apis/library/classroom.googleapis.com", "_blank")}
                className="gap-2">
                <ExternalLink className="w-4 h-4" /> Open Classroom API
              </Button>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-xl border border-dashed border-border">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Classes Found</h2>
            <p className="text-muted-foreground mb-4">You don't have any active classes in Google Classroom.</p>
            <Button onClick={() => window.open('https://classroom.google.com', '_blank')} className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Open Google Classroom
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[320px,1fr] gap-8">
            {/* Sidebar - Course List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Your Classes ({courses.length})
              </h2>
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isSelected={course.id === selectedCourseId}
                    onSelect={setSelectedCourseId}
                  />
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Course Header */}
              {currentCourse && (
                <div className="bg-card rounded-xl border border-border/50 p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 opacity-5">
                    <GraduationCap className="w-32 h-32" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-primary mb-2">{currentCourse.name}</h1>
                      {currentCourse.descriptionHeading && (
                        <p className="text-muted-foreground max-w-2xl">{currentCourse.descriptionHeading}</p>
                      )}
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
                        <RefreshCw className="w-4 h-4" /> Refresh
                      </Button>
                      {currentCourse.alternateLink && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-2"
                          onClick={() => window.open(currentCourse.alternateLink, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open in Classroom
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="assignments" className="gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Assignments</span>
                  </TabsTrigger>
                  <TabsTrigger value="announcements" className="gap-2">
                    <Megaphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Stream</span>
                  </TabsTrigger>
                  <TabsTrigger value="materials" className="gap-2">
                    <FolderOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Materials</span>
                  </TabsTrigger>
                  <TabsTrigger value="people" className="gap-2">
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">People</span>
                  </TabsTrigger>
                </TabsList>

                {/* Assignments Tab */}
                <TabsContent value="assignments" className="space-y-4">
                  {loadingAssignments ? (
                    <div className="flex flex-col items-center py-12 text-muted-foreground">
                      <Loader2 className="w-8 h-8 animate-spin mb-2" />
                      <p>Fetching assignments...</p>
                    </div>
                  ) : assignments.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-dashed border-border">
                      <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="font-medium">No Assignments</p>
                      <p className="text-sm text-muted-foreground">No assignments have been posted yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <AssignmentCard
                          key={assignment.id}
                          assignment={assignment}
                          onAddLink={handleAddLink}
                          onTurnIn={handleTurnIn}
                          onReclaim={handleReclaim}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Announcements Tab */}
                <TabsContent value="announcements">
                  <AnnouncementsList 
                    announcements={announcements} 
                    loading={loadingAnnouncements} 
                  />
                </TabsContent>

                {/* Materials Tab */}
                <TabsContent value="materials">
                  <MaterialsList 
                    materials={materials} 
                    loading={loadingMaterials} 
                  />
                </TabsContent>

                {/* People Tab */}
                <TabsContent value="people">
                  <PeopleList 
                    teachers={teachers} 
                    students={students} 
                    loading={loadingPeople} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
