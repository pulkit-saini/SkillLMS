import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminAnalyticsService } from '@/services/adminAnalyticsService';
import { AdminAnalytics } from '@/types/adminAnalytics';
import { SchoolOverviewCards } from '@/components/analytics/SchoolOverviewCards';
import { EngagementChart } from '@/components/analytics/EngagementChart';
import { CoursePerformanceTable } from '@/components/analytics/CoursePerformanceTable';
import { TeacherPerformanceTable } from '@/components/analytics/TeacherPerformanceTable';
import { CourseComparisonChart } from '@/components/analytics/CourseComparisonChart';
import { AtRiskStudentsCard } from '@/components/analytics/AtRiskStudentsCard';
import { QuickActionsPanel } from '@/components/admin/QuickActionsPanel';
import { RecentActivityFeed } from '@/components/admin/RecentActivityFeed';
import { UsageReportsCard } from '@/components/admin/UsageReportsCard';
import { GuardianSummaryCard } from '@/components/admin/GuardianSummaryCard';
import { ClassroomInsightsCard } from '@/components/admin/ClassroomInsightsCard';
import { AnnouncementsBanner } from '@/components/admin/AnnouncementsBanner';
import { ExportReportsDialog, ExportOptions } from '@/components/admin/ExportReportsDialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  LayoutDashboard, 
  Loader2, 
  RefreshCw, 
  BarChart3, 
  Users, 
  GraduationCap,
  AlertTriangle,
  Download,
  Activity
} from 'lucide-react';

export default function AdminOverviewPage() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  useEffect(() => {
    if (token) {
      fetchAnalytics();
    }
  }, [token]);

  const fetchAnalytics = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await adminAnalyticsService.getSchoolAnalytics(token);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load admin analytics:', error);
      toast.error('Failed to load school analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
    setIsRefreshing(false);
    toast.success('Analytics refreshed');
  };

  const handleExport = async (options: ExportOptions) => {
    if (!analytics) return;

    const dateRangeLabel = {
      '7days': 'Last 7 Days',
      '30days': 'Last 30 Days',
      '90days': 'Last 90 Days',
      'all': 'All Time'
    }[options.dateRange];

    const activeStudents = analytics.overview.totalStudents - analytics.overview.atRiskStudentsCount - analytics.overview.inactiveStudentsCount;

    if (options.format === 'csv') {
      const rows: string[] = [];
      rows.push(`School Analytics Report - ${dateRangeLabel}`);
      rows.push(`Generated: ${new Date().toLocaleDateString()}`);
      rows.push('');

      if (options.includeStudents) {
        rows.push('STUDENT DATA');
        rows.push(`Total Students,${analytics.overview.totalStudents}`);
        rows.push(`Active Students,${activeStudents}`);
        rows.push(`At-Risk Students,${analytics.overview.atRiskStudentsCount}`);
        rows.push(`Inactive Students,${analytics.overview.inactiveStudentsCount}`);
        rows.push('');
      }

      if (options.includeTeachers) {
        rows.push('TEACHER DATA');
        rows.push(`Total Teachers,${analytics.overview.totalTeachers}`);
        rows.push('');
        rows.push('Teacher,Courses,Students,Assignments,Submission Rate');
        analytics.teacherPerformance.forEach(t => {
          rows.push(`${t.name},${t.coursesCount},${t.totalStudents},${t.totalAssignments},${t.averageSubmissionRate}%`);
        });
        rows.push('');
      }

      if (options.includeCourses) {
        rows.push('COURSE PERFORMANCE');
        rows.push(`Total Courses,${analytics.overview.totalCourses}`);
        rows.push('');
        rows.push('Course,Teacher,Students,Submission Rate,Avg Score');
        analytics.coursePerformance.forEach(c => {
          rows.push(`${c.courseName},${c.teacherName},${c.studentCount},${c.submissionRate}%,${c.averageScore ?? 'N/A'}`);
        });
        rows.push('');
      }

      if (options.includeSubmissions) {
        rows.push('SUBMISSION STATISTICS');
        rows.push(`Total Submissions,${analytics.overview.totalSubmissions}`);
        rows.push(`Overall Submission Rate,${analytics.overview.overallSubmissionRate}%`);
        rows.push(`Overall Late Rate,${analytics.overview.overallLateRate}%`);
        rows.push('');
      }

      if (options.includeGrades) {
        rows.push('GRADE SUMMARY');
        rows.push(`Total Assignments,${analytics.overview.totalAssignments}`);
        rows.push(`Total Submissions,${analytics.overview.totalSubmissions}`);
        rows.push('');
      }

      const csvContent = rows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `school-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // PDF export - create a simple text-based report
      const lines: string[] = [];
      lines.push('SCHOOL ANALYTICS REPORT');
      lines.push(`Date Range: ${dateRangeLabel}`);
      lines.push(`Generated: ${new Date().toLocaleDateString()}`);
      lines.push('');

      if (options.includeStudents) {
        lines.push('--- STUDENT DATA ---');
        lines.push(`Total Students: ${analytics.overview.totalStudents}`);
        lines.push(`Active Students: ${activeStudents}`);
        lines.push(`At-Risk Students: ${analytics.overview.atRiskStudentsCount}`);
        lines.push(`Inactive Students: ${analytics.overview.inactiveStudentsCount}`);
        lines.push('');
      }

      if (options.includeTeachers) {
        lines.push('--- TEACHER DATA ---');
        lines.push(`Total Teachers: ${analytics.overview.totalTeachers}`);
        analytics.teacherPerformance.slice(0, 10).forEach(t => {
          lines.push(`• ${t.name}: ${t.coursesCount} courses, ${t.totalStudents} students, ${t.averageSubmissionRate}% submission rate`);
        });
        lines.push('');
      }

      if (options.includeCourses) {
        lines.push('--- COURSE PERFORMANCE ---');
        lines.push(`Total Courses: ${analytics.overview.totalCourses}`);
        analytics.coursePerformance.slice(0, 10).forEach(c => {
          lines.push(`• ${c.courseName}: ${c.studentCount} students, ${c.submissionRate}% submission rate`);
        });
        lines.push('');
      }

      if (options.includeSubmissions) {
        lines.push('--- SUBMISSION STATISTICS ---');
        lines.push(`Total Submissions: ${analytics.overview.totalSubmissions}`);
        lines.push(`Overall Submission Rate: ${analytics.overview.overallSubmissionRate}%`);
        lines.push(`Overall Late Rate: ${analytics.overview.overallLateRate}%`);
        lines.push('');
      }

      if (options.includeGrades) {
        lines.push('--- GRADE SUMMARY ---');
        lines.push(`Total Assignments: ${analytics.overview.totalAssignments}`);
        lines.push(`Total Submissions: ${analytics.overview.totalSubmissions}`);
      }

      const textContent = lines.join('\n');
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `school-analytics-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  if (isLoading && !analytics) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading school analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            School-wide analytics and performance insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {analytics ? (
        <>
          {/* Overview Cards */}
          <SchoolOverviewCards overview={analytics.overview} />

          {/* Quick Actions + Activity Feed Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <QuickActionsPanel />
            <div className="lg:col-span-2">
              <RecentActivityFeed activities={analytics.recentActivity} />
            </div>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="overview" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-1.5">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="teachers" className="gap-1.5">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Teachers</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="gap-1.5">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Students</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-1.5">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <EngagementChart data={analytics.engagementData} />
                <CourseComparisonChart 
                  courses={analytics.topPerformingCourses}
                  title="Top Performing Courses"
                  description="Courses with highest submission rates"
                />
              </div>
              <div className="grid gap-6 lg:grid-cols-2">
                <CourseComparisonChart 
                  courses={analytics.lowPerformingCourses}
                  title="Courses Needing Attention"
                  description="Courses with lowest submission rates"
                />
                <ClassroomInsightsCard insights={analytics.insights} />
              </div>
              <AnnouncementsBanner announcements={analytics.announcements} />
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <CoursePerformanceTable courses={analytics.coursePerformance} />
            </TabsContent>

            <TabsContent value="teachers" className="space-y-6">
              <TeacherPerformanceTable teachers={analytics.teacherPerformance} />
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <AtRiskStudentsCard students={analytics.atRiskStudents} />
                <Card className="border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertTriangle className="h-12 w-12 text-yellow-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Student Risk Summary</h3>
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-bold text-primary">{analytics.overview.totalStudents}</p>
                      <p className="text-muted-foreground">Total Students</p>
                      <div className="flex gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-xl font-bold text-green-600">
                            {analytics.overview.totalStudents - analytics.overview.atRiskStudentsCount - analytics.overview.inactiveStudentsCount}
                          </p>
                          <p className="text-xs text-muted-foreground">On Track</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-yellow-600">{analytics.overview.atRiskStudentsCount}</p>
                          <p className="text-xs text-muted-foreground">At-Risk</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-destructive">{analytics.overview.inactiveStudentsCount}</p>
                          <p className="text-xs text-muted-foreground">Inactive</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <UsageReportsCard stats={analytics.usageStats} />
                <GuardianSummaryCard stats={analytics.guardianStats} />
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground text-center max-w-md">
              No classroom data found. Make sure you have access to courses in Google Classroom.
            </p>
          </CardContent>
        </Card>
      )}

      <ExportReportsDialog 
        open={exportDialogOpen} 
        onOpenChange={setExportDialogOpen}
        onExport={handleExport}
      />
    </div>
  );
}
