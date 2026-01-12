import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import AdminOverviewPage from './AdminOverviewPage';
import AdminCoursesPage from './AdminCoursesPage';
import AdminCreateClassPage from './AdminCreateClassPage';
import AdminTeachersPage from './AdminTeachersPage';
import AdminStudentsPage from './AdminStudentsPage';
import AdminSettingsPage from './AdminSettingsPage';
import CourseDetailsPage from './CourseDetailsPage';
import AdminStudentDetailPage from './AdminStudentDetailPage';
import AdminTeacherDetailPage from './AdminTeacherDetailPage';

export default function AdminDashboard() {
  return (
    <DashboardLayout allowedRoles={['admin']}>
      <Routes>
        <Route index element={<AdminOverviewPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="course/:courseId" element={<CourseDetailsPage />} />
        <Route path="create-class" element={<AdminCreateClassPage />} />
        <Route path="teachers" element={<AdminTeachersPage />} />
        <Route path="teacher/:teacherId" element={<AdminTeacherDetailPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="student/:studentId" element={<AdminStudentDetailPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Routes>
    </DashboardLayout>
  );
}
