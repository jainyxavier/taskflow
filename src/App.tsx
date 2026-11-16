import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Projects from "./pages/Projects";
import ProjectOverview from "./pages/ProjectOverview";
import ProjectBoard from "./pages/ProjectBoard";
import ProjectBacklog from "./pages/ProjectBacklog";
import ProjectSprints from "./pages/ProjectSprints";
import ProjectEpics from "./pages/ProjectEpics";
import ProjectMembers from "./pages/ProjectMembers";
import ProjectSettings from "./pages/ProjectSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AppShell from "./components/layout/AppShell";
import ProjectLayout from "./components/layout/ProjectLayout";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/cadastro" element={<Register />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppShell />}>
                        <Route path="/" element={<Navigate to="/projects" replace />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/projects/:projectId" element={<ProjectLayout />}>
                            <Route index element={<Navigate to="overview" replace />} />
                            <Route path="overview" element={<ProjectOverview />} />
                            <Route path="board" element={<ProjectBoard />} />
                            <Route path="backlog" element={<ProjectBacklog />} />
                            <Route path="sprints" element={<ProjectSprints />} />
                            <Route path="epics" element={<ProjectEpics />} />
                            <Route path="members" element={<ProjectMembers />} />
                            <Route path="settings" element={<ProjectSettings />} />
                        </Route>
                    </Route>
                </Route>
                <Route path="*" element={<Navigate to="/projects" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
