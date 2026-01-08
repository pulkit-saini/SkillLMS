import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { classroomAnalyticsService } from '@/services/classroomAnalyticsService';
import { CourseAnalytics } from '@/types/analytics';
import { Course } from '@/services/classroomService';
import { AnalyticsCards } from '@/components/analytics/AnalyticsCards';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { AssignmentStats } from '@/components/analytics/AssignmentStats';
import { StudentProgressTable } from '@/components/analytics/StudentProgressTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, RefreshCw, BarChart3, FileBarChart, Table, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function TeacherAnalyticsPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [assignmentViewMode, setAssignmentViewMode] = useState<'table' | 'chart'>('table');

  useEffect(() => {
    if (token) {
      loadCourses();
    }
  }, [token]);

  useEffect(() => {
    if (token && courses.length > 0) {
      loadAnalytics();
    }
  }, [token, selectedCourseId, courses]);

  const loadCourses = async () => {
    if (!token) return;
    try {
      const teacherCourses = await classroomAnalyticsService.getTeacherCourses(token);
      setCourses(teacherCourses);
    } catch (error) {
      console.error('Failed to load courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const loadAnalytics = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      let data: CourseAnalytics | null;
      
      if (selectedCourseId === 'all') {
        data = await classroomAnalyticsService.getAggregatedAnalytics(token);
      } else {
        const course = courses.find((c) => c.id === selectedCourseId);
        if (course) {
          data = await classroomAnalyticsService.getCourseAnalytics(token, course.id, course.name);
        } else {
          data = null;
        }
      }
      
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalytics();
    setIsRefreshing(false);
    toast.success('Analytics refreshed');
  };

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">View classroom engagement and performance</p>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Classes Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You don't have any classes yet. Create a class first to view analytics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            View classroom engagement and performance insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {analytics ? (
        <>
          {/* KPI Cards */}
          <AnalyticsCards summary={analytics.summary} />

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Engagement Chart */}
            <EngagementChart data={analytics.engagementData} />

            {/* Assignment Stats */}
            <div className="space-y-4">
              <div className="flex items-center justify-end">
                <Tabs 
                  value={assignmentViewMode} 
                  onValueChange={(v) => setAssignmentViewMode(v as 'table' | 'chart')}
                >
                  <TabsList className="grid w-[160px] grid-cols-2">
                    <TabsTrigger value="table" className="gap-1">
                      <Table className="h-3 w-3" />
                      List
                    </TabsTrigger>
                    <TabsTrigger value="chart" className="gap-1">
                      <FileBarChart className="h-3 w-3" />
                      Chart
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <AssignmentStats 
                assignments={analytics.assignmentStats} 
                viewMode={assignmentViewMode}
              />
            </div>
          </div>

          {/* Student Progress Table */}
          <StudentProgressTable students={analytics.studentProgress} />
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Data Available</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No analytics data found for the selected course. Try selecting a different course or check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
