
import React, { useState } from 'react';
import { User, Role, AcademicFile, Enrollment } from '../types';
import StatCard from '../components/StatCard';
import FileList from '../components/FileList';
import FileViewerModal from '../components/FileViewerModal';
import { DocumentTextIcon, UsersIcon, DownloadIcon, ClockIcon, UploadIcon, BookOpenIcon } from '../components/icons';

interface DashboardProps {
    user: User;
    files: AcademicFile[];
    enrollments: Enrollment[];
}

const AdminDashboard: React.FC<{files: AcademicFile[], enrollments: Enrollment[]}> = ({ files, enrollments }) => {
    const [viewingFile, setViewingFile] = useState<AcademicFile | null>(null);
    const totalFiles = files.length;
    const totalUsers = 342;
    const activeUsers = 298;
    const totalDownloads = files.reduce((sum, file) => sum + file.downloads, 0);
    const pendingValidations = enrollments.filter(e => e.status === 'pending').length;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Painel Administrativo</h1>
                <p className="text-brand-gray-500 mt-1">Gerencie usuários, arquivos e validações do sistema acadêmico</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total de Arquivos" 
                    value={totalFiles.toString()} 
                    icon={<DocumentTextIcon className="w-6 h-6 text-blue-500" />} 
                    change="+12%"
                    changeColor="text-green-500"
                    changeText="desde o mês passado"
                />
                <StatCard 
                    title="Usuários Ativos" 
                    value={activeUsers.toString()}
                    icon={<UsersIcon className="w-6 h-6 text-indigo-500" />} 
                    changeText={`de ${totalUsers} usuários totais`}
                />
                <StatCard 
                    title="Downloads Totais" 
                    value={totalDownloads.toLocaleString('pt-BR')} 
                    icon={<DownloadIcon className="w-6 h-6 text-green-500" />}
                    change="+5%"
                    changeColor="text-green-500"
                    changeText="esta semana"
                />
                <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-brand-gray-500">Validações Pendentes</h3>
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <ClockIcon className="w-6 h-6 text-orange-500" />
                            </div>
                        </div>
                        <p className="text-4xl font-bold text-brand-gray-800 mt-2">{pendingValidations}</p>
                    </div>
                    <button className="w-full mt-4 bg-brand-gray-800 text-white font-semibold py-2 rounded-lg hover:bg-brand-gray-700 transition-colors">
                        Revisar
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <FileList title="Arquivos Recentes" subtitle="Últimos arquivos publicados no sistema" files={files} onViewFile={setViewingFile} />
            </div>
            
            <FileViewerModal isOpen={!!viewingFile} onClose={() => setViewingFile(null)} file={viewingFile} />
        </div>
    );
};

const StudentDashboard: React.FC<{ user: User; files: AcademicFile[]}> = ({ user, files }) => {
    const [viewingFile, setViewingFile] = useState<AcademicFile | null>(null);
    const userFiles = 8;
    const userDownloads = 156;
    const totalRepoFiles = files.length;
    const recentActivityFiles = files.filter(f => f.course === user.course);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Olá, {user.name}</h1>
                <p className="text-brand-gray-500 mt-1">Bem-vindo ao seu repositório acadêmico - {user.course}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Meus Arquivos" 
                    value={userFiles.toString()}
                    icon={<DocumentTextIcon className="w-6 h-6 text-blue-500" />} 
                    actionButton={{ text: "Ver Arquivos", onClick: () => {} }}
                />
                <StatCard 
                    title="Downloads" 
                    value={userDownloads.toString()}
                    icon={<DownloadIcon className="w-6 h-6 text-green-500" />} 
                    changeText="dos seus arquivos"
                />
                <StatCard 
                    title="Repositório" 
                    value={totalRepoFiles.toLocaleString('pt-BR')} 
                    icon={<BookOpenIcon className="w-6 h-6 text-purple-500" />}
                    actionButton={{ text: "Explorar", onClick: () => {} }}
                />
                <div className="bg-white p-6 rounded-2xl border border-brand-gray-200 shadow-sm flex flex-col justify-between items-center text-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <UploadIcon className="w-8 h-8 text-brand-blue-600" />
                    </div>
                    <h3 className="font-semibold text-brand-gray-800 mt-3 text-lg">Publicar</h3>
                    <p className="text-brand-gray-500 text-sm mt-1">Compartilhe seu trabalho</p>
                    <button className="w-full mt-4 bg-brand-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-brand-blue-600 transition-colors flex items-center justify-center gap-2">
                       <UploadIcon className="w-5 h-5"/> Novo Arquivo
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <FileList title="Atividade Recente" subtitle="Arquivos populares do seu curso e área de interesse" files={recentActivityFiles} onViewFile={setViewingFile} />
            </div>
            
            <FileViewerModal isOpen={!!viewingFile} onClose={() => setViewingFile(null)} file={viewingFile} />
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ user, files, enrollments }) => {
  return user.role === Role.Admin 
    ? <AdminDashboard files={files} enrollments={enrollments}/> 
    : <StudentDashboard user={user} files={files}/>;
};

export default Dashboard;
