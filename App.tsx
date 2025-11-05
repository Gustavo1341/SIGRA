
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { User, Enrollment, Course, AcademicFile, Role } from './types';
import { MOCK_FILES, MOCK_ENROLLMENTS, MOCK_USERS, MOCK_COURSES } from './data';
import { testSupabaseConnection } from './lib/supabase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './pages/PlaceholderPage';
import ValidateEnrollmentsPage from './pages/ValidateEnrollmentsPage';
import UserManagementPage from './pages/UserManagementPage';
import AllCoursesPage from './pages/AllCoursesPage';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LoadingScreen from './pages/LoadingScreen';
import PublishFilePage from './pages/PublishFilePage';
import SettingsPage from './pages/SettingsPage';
import MyFilesPage from './pages/MyFilesPage';

const AppContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(MOCK_ENROLLMENTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [files, setFiles] = useState<AcademicFile[]>(MOCK_FILES);
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  
  const { currentUser, logout: authLogout, updateUser } = useAuth();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Testar conexão com Supabase
        const isConnected = await testSupabaseConnection();
        if (!isConnected) {
          console.warn('Falha na conexão com Supabase. Usando dados mockados.');
        }
      } catch (error) {
        console.error('Erro ao inicializar aplicação:', error);
      } finally {
        // Simular loading por 1 segundo
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    initializeApp();
  }, []);

  const handleLogout = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      authLogout();
      setIsFadingOut(false);
    }, 500);
  };
  
  const handleAddFile = (newFileData: Omit<AcademicFile, 'id' | 'downloads' | 'uploadedAt'>) => {
    const newFile: AcademicFile = {
        ...newFileData,
        id: files.length > 0 ? Math.max(...files.map(f => f.id)) + 1 : 1,
        downloads: 0,
        uploadedAt: 'agora mesmo',
        description: newFileData.description || '',
    };
    setFiles(prevFiles => [newFile, ...prevFiles]);
  };

  const pendingEnrollmentsCount = enrollments.filter(e => e.status === 'pending').length;

  const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className={`min-h-screen bg-brand-gray-25 text-brand-gray-900 ${isFadingOut ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
            <Sidebar 
                user={currentUser!} 
                pendingEnrollmentsCount={pendingEnrollmentsCount}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Header 
                    user={currentUser!} 
                    onLogout={handleLogout} 
                    onMenuClick={() => setIsSidebarOpen(true)}
                />
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          {/* Common Routes */}
          <Route index element={<Dashboard user={currentUser} files={files} enrollments={enrollments} />} />
          <Route path="dashboard" element={<Dashboard user={currentUser} files={files} enrollments={enrollments} />} />
          <Route path="all-courses" element={<AllCoursesPage currentUser={currentUser} courses={courses} setCourses={setCourses} users={users} setUsers={setUsers} files={files} setFiles={setFiles} />} />
          <Route path="explore/:courseName" element={<ExplorePage files={files} />} />
          <Route path="explore/:courseName/:semester" element={<ExplorePage files={files} />} />
          <Route path="explore/:courseName/:semester/:subject" element={<ExplorePage files={files} />} />
          <Route path="settings" element={<SettingsPage user={currentUser!} setUser={updateUser} />} />
          
          {/* Admin Only Routes */}
          <Route path="validate-enrollments" element={
            <ProtectedRoute allowedRoles={[Role.Admin]}>
              <ValidateEnrollmentsPage enrollments={enrollments} setEnrollments={setEnrollments} users={users} setUsers={setUsers} currentUser={currentUser} />
            </ProtectedRoute>
          } />
          <Route path="user-management" element={
            <ProtectedRoute allowedRoles={[Role.Admin]}>
              <UserManagementPage currentUser={currentUser!} courses={courses} />
            </ProtectedRoute>
          } />
          <Route path="reports" element={
            <ProtectedRoute allowedRoles={[Role.Admin]}>
              <PlaceholderPage title="Relatórios" />
            </ProtectedRoute>
          } />

          {/* Student Only Routes */}
          <Route path="my-files" element={
            <ProtectedRoute allowedRoles={[Role.Student]}>
              <MyFilesPage currentUser={currentUser!} files={files} />
            </ProtectedRoute>
          } />
          <Route path="publish-file" element={
            <ProtectedRoute allowedRoles={[Role.Student]}>
              <PublishFilePage currentUser={currentUser!} courses={courses} onAddFile={handleAddFile} />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
