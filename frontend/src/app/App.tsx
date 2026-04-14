import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import SchedulePage from "@/pages/SchedulePage";
import TeachersPage from "@/pages/TeachersPage";
import GroupsPage from "@/pages/GroupsPage";
import RoomsPage from "@/pages/RoomsPage";
import FacultiesPage from "@/pages/FacultiesPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import SubjectsPage from "@/pages/SubjectsPage";
import LoadsPage from "@/pages/LoadsPage";
import BuildingsPage from "@/pages/BuildingsPage";
import AppShell from "@/components/AppShell";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("tatu_token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="buildings" element={<BuildingsPage />} />
        <Route path="faculties" element={<FacultiesPage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="subjects" element={<SubjectsPage />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="rooms" element={<RoomsPage />} />
        <Route path="loads" element={<LoadsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
