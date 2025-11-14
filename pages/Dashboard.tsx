
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Role, AcademicFile, Enrollment } from '../types';
import StatCard from '../components/StatCard';
import FileList from '../components/FileList';
import { DocumentTextIcon, UsersIcon, DownloadIcon, ClockIcon, UploadIcon, BookOpenIcon } from '../components/icons';
import { dashboardService, DashboardStats } from '../services/dashboard.service';

interface DashboardProps {
    user: User;
    files: AcademicFile[];
    enrollments: Enrollment[];
}

const AdminDashboard: React.FC<{files: AcademicFile[], enrollments: Enrollment[]}> = ({ files, enrollments }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentFiles, setRecentFiles] = useState<AcademicFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Buscar estatísticas e arquivos recentes em paralelo
                const [statsData, filesData] = await Promise.all([
                    dashboardService.getAdminStats(),
                    dashboardService.getRecentFiles(10)
                ]);

                setStats(statsData);
                setRecentFiles(filesData);
            } catch (err) {
                console.error('Erro ao carregar dados do dashboard:', err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Loading skeleton
    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Painel Administrativo</h1>
                    <p className="text-brand-gray-500 mt-1">Gerencie usuários, arquivos e validações do sistema acadêmico</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-brand-gray-300 animate-pulse">
                            <div className="h-4 bg-brand-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-brand-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <div className="h-6 bg-brand-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-brand-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Painel Administrativo</h1>
                    <p className="text-brand-gray-500 mt-1">Gerencie usuários, arquivos e validações do sistema acadêmico</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-semibold">Erro ao carregar dados</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Painel Administrativo</h1>
                <p className="text-brand-gray-500 mt-1">Gerencie usuários, arquivos e validações do sistema acadêmico</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total de Arquivos" 
                    value={stats?.totalFiles.toString() || '0'} 
                    icon={<DocumentTextIcon className="w-6 h-6 text-blue-500" />} 
                />
                <StatCard 
                    title="Usuários Ativos" 
                    value={stats?.activeUsers.toString() || '0'}
                    icon={<UsersIcon className="w-6 h-6 text-indigo-500" />} 
                    changeText={`de ${stats?.totalUsers || 0} usuários totais`}
                />
                <StatCard 
                    title="Downloads Totais" 
                    value={stats?.totalDownloads.toLocaleString('pt-BR') || '0'} 
                    icon={<DownloadIcon className="w-6 h-6 text-green-500" />}
                />
                <div className="bg-white p-6 rounded-2xl border border-brand-gray-300 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-brand-gray-500">Validações Pendentes</h3>
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <ClockIcon className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-brand-gray-800 mt-2">{stats?.pendingEnrollments || 0}</p>
                    </div>
                    <button className="w-full mt-4 bg-brand-gray-800 text-white font-semibold py-2 rounded-lg hover:bg-brand-gray-700 transition-colors">
                        Revisar
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <FileList 
                    title="Arquivos Recentes" 
                    subtitle="Últimos arquivos publicados no sistema" 
                    files={recentFiles}
                    currentUserId={user.id}
                />
            </div>
        </div>
    );
};

const StudentDashboard: React.FC<{ user: User; files: AcademicFile[]}> = ({ user, files }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [courseFiles, setCourseFiles] = useState<AcademicFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Buscar estatísticas do estudante e arquivos do curso em paralelo
                const [statsData, filesData] = await Promise.all([
                    dashboardService.getStudentStats(user.id),
                    dashboardService.getCourseFiles(user.course, 10)
                ]);

                setStats(statsData);
                setCourseFiles(filesData);
            } catch (err) {
                console.error('Erro ao carregar dados do dashboard:', err);
                setError(err instanceof Error ? err.message : 'Erro ao carregar dados do dashboard');
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [user.id, user.course]);

    // Loading skeleton
    if (loading) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Olá, {user.name}</h1>
                    <p className="text-brand-gray-500 mt-1">Bem-vindo ao seu repositório acadêmico - {user.course}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-brand-gray-300 animate-pulse">
                            <div className="h-4 bg-brand-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-brand-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
                <div className="mt-8">
                    <div className="h-6 bg-brand-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 bg-brand-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div>
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Olá, {user.name}</h1>
                    <p className="text-brand-gray-500 mt-1">Bem-vindo ao seu repositório acadêmico - {user.course}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-semibold">Erro ao carregar dados</p>
                    <p className="text-red-600 text-sm mt-1">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Olá, {user.name}</h1>
                <p className="text-brand-gray-500 mt-1">Bem-vindo ao seu repositório acadêmico - {user.course}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Meus Arquivos" 
                    value={stats?.userFiles?.toString() || '0'}
                    icon={<DocumentTextIcon className="w-6 h-6 text-blue-500" />} 
                    actionButton={{ text: "Ver Arquivos", onClick: () => navigate('/my-files') }}
                />
                <StatCard 
                    title="Downloads" 
                    value={stats?.userDownloads?.toString() || '0'}
                    icon={<DownloadIcon className="w-6 h-6 text-green-500" />} 
                    changeText="dos seus arquivos"
                />
                <StatCard 
                    title="Repositório" 
                    value={stats?.totalFiles.toLocaleString('pt-BR') || '0'} 
                    icon={<BookOpenIcon className="w-6 h-6 text-purple-500" />}
                    actionButton={{ text: "Explorar", onClick: () => navigate(`/explore/${encodeURIComponent(user.course)}`) }}
                />
                <div className="bg-white p-6 rounded-2xl border border-brand-gray-300 flex flex-col justify-between items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <UploadIcon className="w-8 h-8 text-brand-blue-600" />
                    </div>
                    <h3 className="font-semibold text-brand-gray-800 mt-3 text-lg">Publicar</h3>
                    <p className="text-brand-gray-500 text-sm mt-1">Compartilhe seu trabalho</p>
                    <button 
                        onClick={() => navigate('/publish-file')}
                        className="w-full mt-4 bg-brand-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-brand-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                       <UploadIcon className="w-5 h-5"/> Novo Arquivo
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <FileList 
                    title="Atividade Recente" 
                    subtitle="Arquivos populares do seu curso e área de interesse" 
                    files={courseFiles}
                    currentUserId={user.id}
                />
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ user, files, enrollments }) => {
  return user.role === Role.Admin 
    ? <AdminDashboard files={files} enrollments={enrollments}/> 
    : <StudentDashboard user={user} files={files}/>;
};

export default Dashboard;
