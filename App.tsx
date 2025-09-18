
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { User, Enrollment, Course, AcademicFile, Role } from './types';
import { MOCK_FILES, MOCK_ENROLLMENTS, MOCK_USERS, MOCK_COURSES } from './data';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import ValidateEnrollmentsPage from './pages/ValidateEnrollmentsPage';
import UserManagementPage from './pages/UserManagementPage';
import AllCoursesPage from './pages/AllCoursesPage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import LoadingScreen from './pages/LoadingScreen';
import PublishFilePage from './pages/PublishFilePage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(MOCK_ENROLLMENTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [files, setFiles] = useState<AcademicFile[]>(MOCK_FILES);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simulate loading for 2 seconds
    return () => clearTimeout(timer);
  }, []);


  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setIsFadingOut(true);
    setTimeout(() => {
        setCurrentUser(null);
        setIsFadingOut(false);
    }, 500); // Match animation duration
  };
  
  const handleAddFile = (newFileData: Omit<AcademicFile, 'id' | 'downloads' | 'uploadedAt' | 'lastUpdateMessage'>) => {
    const newFile: AcademicFile = {
        ...newFileData,
        id: files.length > 0 ? Math.max(...files.map(f => f.id)) + 1 : 1,
        downloads: 0,
        uploadedAt: 'agora mesmo',
        lastUpdateMessage: 'feat: Criação inicial do arquivo',
        description: newFileData.description || '',
    };
    setFiles(prevFiles => [newFile, ...prevFiles]);
  };

  const pendingEnrollmentsCount = enrollments.filter(e => e.status === 'pending').length;

  const Layout: React.FC = () => (
    <div className={`flex h-screen bg-brand-gray-50 text-brand-gray-800 ${isFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
      <Sidebar user={currentUser!} pendingEnrollmentsCount={pendingEnrollmentsCount} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser!} onLogout={handleLogout} />
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return (
      <HashRouter>
        <Routes>
          <Route path="*" element={<LoginPage onLogin={handleLogin} />} />
        </Routes>
      </HashRouter>
    );
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Navigate to="/dashboard" />} />
        <Route path="/" element={<Layout />}>
          {/* Common Routes */}
          <Route index element={<Dashboard user={currentUser} files={files} enrollments={enrollments} />} />
          <Route path="dashboard" element={<Dashboard user={currentUser} files={files} enrollments={enrollments} />} />
          <Route path="all-courses" element={<AllCoursesPage currentUser={currentUser} courses={courses} setCourses={setCourses} users={users} setUsers={setUsers} files={files} setFiles={setFiles} />} />
          <Route path="explore/:courseName" element={<ExplorePage files={files} />} />
          <Route path="explore/:courseName/:semester" element={<ExplorePage files={files} />} />
          <Route path="explore/:courseName/:semester/:subject" element={<ExplorePage files={files} />} />
          <Route path="explore" element={<PlaceholderPage title="Explorar Repositório" message="Selecione um curso na página 'Todos os Cursos' para começar a explorar." />} />
          <Route path="settings" element={<SettingsPage user={currentUser} setUser={setCurrentUser} />} />
          
          {/* Admin Only Routes */}
          {currentUser.role === Role.Admin && (
            <>
              <Route path="validate-enrollments" element={<ValidateEnrollmentsPage enrollments={enrollments} setEnrollments={setEnrollments} users={users} setUsers={setUsers} />} />
              <Route path="user-management" element={<UserManagementPage users={users} setUsers={setUsers} currentUser={currentUser} courses={courses} />} />
              <Route path="reports" element={<PlaceholderPage title="Relatórios" />} />
            </>
          )}

          {/* Student Only Routes */}
          {currentUser.role === Role.Student && (
            <>
              <Route path="my-files" element={<PlaceholderPage title="Meus Arquivos" />} />
              <Route path="publish-file" element={<PublishFilePage currentUser={currentUser} courses={courses} onAddFile={handleAddFile} />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
