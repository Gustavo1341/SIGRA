
import React, { useState } from 'react';
import { User, Role } from '../types';
import { UserCircleIcon, LockClosedIcon, CogIcon, MoonIcon, BellIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon } from '../components/icons';

interface SettingsPageProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ user, setUser }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const isAdmin = user.role === Role.Admin;

    const navItems = [
        { id: 'profile', label: 'Perfil', icon: <UserCircleIcon className="w-5 h-5" /> },
        { id: 'security', label: 'Segurança', icon: <ShieldCheckIcon className="w-5 h-5" /> },
        isAdmin && { id: 'system', label: 'Sistema', icon: <CogIcon className="w-5 h-5" /> },
        { id: 'appearance', label: 'Aparência', icon: <MoonIcon className="w-5 h-5" /> },
        isAdmin && { id: 'notifications', label: 'Notificações', icon: <BellIcon className="w-5 h-5" /> },
    // Fix: Changed JSX.Element to React.ReactElement to resolve namespace error.
    ].filter(Boolean) as { id: string; label: string; icon: React.ReactElement }[];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-brand-gray-800">Configurações</h1>
                <p className="text-brand-gray-500 mt-1">Gerencie suas preferências de perfil, segurança e sistema.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                {/* Left Nav */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-3 rounded-2xl border border-brand-gray-200 shadow-sm">
                        <nav className="flex flex-row lg:flex-col gap-1 flex-wrap">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${
                                    activeTab === item.id 
                                    ? 'bg-brand-blue-500 text-white shadow' 
                                    : 'text-brand-gray-600 hover:bg-brand-gray-100 hover:text-brand-gray-900'
                                }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                        </nav>
                    </div>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-3">
                    {activeTab === 'profile' && <ProfileSettings user={user} setUser={setUser} />}
                    {activeTab === 'security' && <SecuritySettings />}
                    {isAdmin && activeTab === 'system' && <SystemSettings />}
                    {activeTab === 'appearance' && <AppearanceSettings />}
                    {isAdmin && activeTab === 'notifications' && <NotificationSettings />}
                </div>
            </div>
        </div>
    );
};

// --- Settings Components ---

const SettingsCard: React.FC<{title: string, description: string, children: React.ReactNode, footer?: React.ReactNode}> = ({ title, description, children, footer }) => (
    <div className="bg-white rounded-2xl border border-brand-gray-200 shadow-sm animate-fadeIn">
        <div className="p-6 border-b border-brand-gray-200">
            <h2 className="text-xl font-bold text-brand-gray-800">{title}</h2>
            <p className="text-sm text-brand-gray-500 mt-1">{description}</p>
        </div>
        <div className="p-6">
            {children}
        </div>
        {footer && (
            <div className="p-4 bg-brand-gray-50 border-t border-brand-gray-200 rounded-b-2xl flex justify-end">
                {footer}
            </div>
        )}
    </div>
);

const ProfileSettings: React.FC<{user: User, setUser: React.Dispatch<React.SetStateAction<User | null>>}> = ({ user, setUser }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    
    const handleSave = () => {
        setUser(prev => prev ? {...prev, name, email} : null);
        alert('Perfil atualizado!');
    }

    return (
        <SettingsCard 
            title="Perfil Público" 
            description="Estas informações serão exibidas publicamente."
            footer={
                <button onClick={handleSave} className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 shadow">
                    Salvar Alterações
                </button>
            }
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brand-gray-700">Nome Completo</label>
                    <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm text-brand-gray-800" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brand-gray-700">Email</label>
                    <input type="email" name="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm text-brand-gray-800" />
                </div>
            </div>
        </SettingsCard>
    );
};

const PasswordInput: React.FC<{id: string, label: string}> = ({ id, label }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-brand-gray-700">{label}</label>
            <div className="relative mt-1">
                <input type={isVisible ? 'text' : 'password'} name={id} id={id} className="block w-full px-3 py-2 bg-white border border-brand-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm text-brand-gray-800" />
                <button type="button" onClick={() => setIsVisible(!isVisible)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-gray-400 hover:text-brand-gray-600">
                    {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
};

const SecuritySettings = () => {
    return (
        <SettingsCard 
            title="Segurança da Conta" 
            description="Altere sua senha para manter sua conta segura."
            footer={
                <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 shadow">
                    Alterar Senha
                </button>
            }
        >
            <div className="space-y-4">
                <PasswordInput id="current_password" label="Senha Atual" />
                <PasswordInput id="new_password" label="Nova Senha" />
                <PasswordInput id="confirm_password" label="Confirmar Nova Senha" />
            </div>
        </SettingsCard>
    );
};

const SystemSettings = () => {
    const [maintenance, setMaintenance] = useState(false);
    return (
        <SettingsCard 
            title="Configurações do Sistema" 
            description="Ajustes globais para o funcionamento do SIGRA."
            footer={
                <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 shadow">
                    Salvar Configurações
                </button>
            }
        >
            <div className="flex items-center justify-between p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                <div>
                    <h3 className="font-medium text-brand-gray-800">Modo Manutenção</h3>
                    <p className="text-sm text-brand-gray-500">Impede o login de alunos e exibe uma página de aviso.</p>
                </div>
                <button onClick={() => setMaintenance(!maintenance)} className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${maintenance ? 'bg-brand-blue-600' : 'bg-brand-gray-200'}`}>
                    <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${maintenance ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>
        </SettingsCard>
    );
};


const AppearanceSettings = () => {
    const [theme, setTheme] = useState('light');
    return (
        <SettingsCard 
            title="Aparência" 
            description="Personalize a aparência da interface."
        >
            <div>
                <h3 className="text-sm font-medium text-brand-gray-700 mb-2">Tema</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => setTheme('light')} className={`p-4 rounded-lg border-2 ${theme === 'light' ? 'border-brand-blue-500' : 'border-brand-gray-200'}`}>
                        <div className="w-full h-20 bg-brand-gray-100 rounded-md border border-brand-gray-200"></div>
                        <p className="mt-2 font-semibold text-brand-gray-800">Claro</p>
                    </button>
                    <button onClick={() => setTheme('dark')} className={`p-4 rounded-lg border-2 ${theme === 'dark' ? 'border-brand-blue-500' : 'border-brand-gray-200'}`}>
                        <div className="w-full h-20 bg-brand-gray-800 rounded-md border border-brand-gray-700"></div>
                        <p className="mt-2 font-semibold text-brand-gray-800">Escuro</p>
                    </button>
                </div>
            </div>
        </SettingsCard>
    );
};

const NotificationSettings = () => {
    return (
        <SettingsCard 
            title="Notificações por Email" 
            description="Escolha quais notificações você deseja receber."
            footer={
                <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 shadow">
                    Salvar Preferências
                </button>
            }
        >
            <div className="space-y-4">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="enrollments" name="enrollments" type="checkbox" defaultChecked className="focus:ring-brand-blue-500 h-4 w-4 text-brand-blue-600 border-brand-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="enrollments" className="font-medium text-brand-gray-700">Novas matrículas pendentes</label>
                        <p className="text-brand-gray-500">Receba um alerta sempre que um novo aluno solicitar matrícula.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="reports" name="reports" type="checkbox" className="focus:ring-brand-blue-500 h-4 w-4 text-brand-blue-600 border-brand-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="reports" className="font-medium text-brand-gray-700">Relatórios semanais</label>
                        <p className="text-brand-gray-500">Receba um resumo da atividade do repositório toda semana.</p>
                    </div>
                </div>
                 <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input id="files" name="files" type="checkbox" defaultChecked className="focus:ring-brand-blue-500 h-4 w-4 text-brand-blue-600 border-brand-gray-300 rounded" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="files" className="font-medium text-brand-gray-700">Novos arquivos publicados</label>
                        <p className="text-brand-gray-500">Receba uma notificação quando um arquivo for publicado em um curso de destaque.</p>
                    </div>
                </div>
            </div>
        </SettingsCard>
    );
};

export default SettingsPage;
