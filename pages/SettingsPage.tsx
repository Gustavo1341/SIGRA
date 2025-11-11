
import React, { useState } from 'react';
import { User, Role } from '../types';
import { UserCircleIcon, LockClosedIcon, CogIcon, MoonIcon, BellIcon, ShieldCheckIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, MailIcon, IdentificationIcon } from '../components/icons';
import { useToast } from '../contexts/ToastContext';

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
                    <div className="bg-white p-3 rounded-2xl border border-brand-gray-300">
                        <nav className="flex flex-row lg:flex-col gap-1 flex-wrap">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${
                                    activeTab === item.id 
                                    ? 'bg-brand-blue-500 text-white' 
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
    <div className="bg-white rounded-2xl border border-brand-gray-300 animate-fadeIn">
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
    const [bio, setBio] = useState('');
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
    const handleSave = async () => {
        setIsSaving(true);
        // Simular salvamento
        await new Promise(resolve => setTimeout(resolve, 800));
        setUser(prev => prev ? {...prev, name, email} : null);
        setIsSaving(false);
        showToast('Perfil atualizado com sucesso!', 'success');
    }

    const hasChanges = name !== user.name || email !== user.email;

    return (
        <div className="space-y-6">
            <SettingsCard 
                title="Informações Pessoais" 
                description="Atualize suas informações de perfil e como outros usuários te veem."
                footer={
                    <div className="flex items-center justify-between w-full">
                        <p className="text-sm text-brand-gray-500">
                            {hasChanges ? 'Você tem alterações não salvas' : 'Todas as alterações foram salvas'}
                        </p>
                        <button 
                            onClick={handleSave} 
                            disabled={!hasChanges || isSaving}
                            className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Salvar Alterações
                                </>
                            )}
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-brand-gray-200">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-blue-500 to-brand-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-brand-gray-800">{name}</h3>
                            <p className="text-sm text-brand-gray-500">{user.role === Role.Admin ? 'Administrador' : 'Estudante'}</p>
                            <button className="mt-2 text-sm text-brand-blue-600 hover:text-brand-blue-700 font-medium">
                                Alterar foto
                            </button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-brand-gray-700 mb-2">
                                <IdentificationIcon className="w-4 h-4" />
                                Nome Completo
                            </label>
                            <input 
                                type="text" 
                                name="name" 
                                id="name" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                className="block w-full px-4 py-2.5 bg-white border border-brand-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent text-brand-gray-800 transition-all" 
                                placeholder="Seu nome completo"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-brand-gray-700 mb-2">
                                <MailIcon className="w-4 h-4" />
                                Email
                            </label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} 
                                className="block w-full px-4 py-2.5 bg-white border border-brand-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent text-brand-gray-800 transition-all" 
                                placeholder="seu.email@exemplo.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bio" className="flex items-center gap-2 text-sm font-medium text-brand-gray-700 mb-2">
                            Biografia (opcional)
                        </label>
                        <textarea 
                            name="bio" 
                            id="bio" 
                            rows={4}
                            value={bio} 
                            onChange={e => setBio(e.target.value)} 
                            className="block w-full px-4 py-2.5 bg-white border border-brand-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent text-brand-gray-800 transition-all resize-none" 
                            placeholder="Conte um pouco sobre você..."
                        />
                        <p className="mt-1 text-xs text-brand-gray-500">{bio.length}/200 caracteres</p>
                    </div>
                </div>
            </SettingsCard>

            {/* Account Info Card */}
            <div className="bg-gradient-to-br from-brand-blue-50 to-brand-blue-100 rounded-2xl border border-brand-blue-200 p-6">
                <h3 className="text-lg font-semibold text-brand-gray-800 mb-4">Informações da Conta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-brand-blue-200">
                        <p className="text-xs text-brand-gray-500 mb-1">ID do Usuário</p>
                        <p className="text-sm font-mono font-semibold text-brand-gray-800">#{user.id}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-brand-blue-200">
                        <p className="text-xs text-brand-gray-500 mb-1">Tipo de Conta</p>
                        <p className="text-sm font-semibold text-brand-gray-800">{user.role === Role.Admin ? 'Administrador' : 'Estudante'}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-brand-blue-200">
                        <p className="text-xs text-brand-gray-500 mb-1">Matrícula</p>
                        <p className="text-sm font-mono font-semibold text-brand-gray-800">{user.registration}</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-brand-blue-200">
                        <p className="text-xs text-brand-gray-500 mb-1">Curso</p>
                        <p className="text-sm font-semibold text-brand-gray-800">{user.course}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PasswordInputField: React.FC<{id: string, label: string, value: string, onChange: (value: string) => void}> = ({ id, label, value, onChange }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-medium text-brand-gray-700 mb-2">
                <LockClosedIcon className="w-4 h-4" />
                {label}
            </label>
            <div className="relative">
                <input 
                    type={isVisible ? 'text' : 'password'} 
                    name={id} 
                    id={id} 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full px-4 py-2.5 pr-12 bg-white border border-brand-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent text-brand-gray-800 transition-all" 
                    placeholder="••••••••"
                />
                <button 
                    type="button" 
                    onClick={() => setIsVisible(!isVisible)} 
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-brand-gray-400 hover:text-brand-gray-600 transition-colors"
                >
                    {isVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
        </div>
    );
};

const SecuritySettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const { showToast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const passwordStrength = (password: string) => {
        if (password.length === 0) return { strength: 0, label: '', color: '' };
        if (password.length < 6) return { strength: 25, label: 'Fraca', color: 'bg-red-500' };
        if (password.length < 10) return { strength: 50, label: 'Média', color: 'bg-yellow-500' };
        if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { strength: 75, label: 'Boa', color: 'bg-blue-500' };
        return { strength: 100, label: 'Forte', color: 'bg-green-500' };
    };

    const strength = passwordStrength(newPassword);
    const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast('Preencha todos os campos', 'error');
            return;
        }
        if (!passwordsMatch) {
            showToast('As senhas não coincidem', 'error');
            return;
        }
        if (strength.strength < 50) {
            showToast('Escolha uma senha mais forte', 'error');
            return;
        }

        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        showToast('Senha alterada com sucesso!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div className="space-y-6">
            <SettingsCard 
                title="Alterar Senha" 
                description="Mantenha sua conta segura com uma senha forte."
                footer={
                    <button 
                        onClick={handleChangePassword}
                        disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Alterando...
                            </>
                        ) : (
                            <>
                                <LockClosedIcon className="w-4 h-4" />
                                Alterar Senha
                            </>
                        )}
                    </button>
                }
            >
                <div className="space-y-5">
                    <PasswordInputField 
                        id="current_password" 
                        label="Senha Atual" 
                        value={currentPassword}
                        onChange={setCurrentPassword}
                    />
                    
                    <div>
                        <PasswordInputField 
                            id="new_password" 
                            label="Nova Senha" 
                            value={newPassword}
                            onChange={setNewPassword}
                        />
                        {newPassword && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-brand-gray-600">Força da senha:</span>
                                    <span className={`text-xs font-semibold ${strength.strength >= 75 ? 'text-green-600' : strength.strength >= 50 ? 'text-blue-600' : 'text-red-600'}`}>
                                        {strength.label}
                                    </span>
                                </div>
                                <div className="w-full bg-brand-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                                        style={{ width: `${strength.strength}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <PasswordInputField 
                            id="confirm_password" 
                            label="Confirmar Nova Senha" 
                            value={confirmPassword}
                            onChange={setConfirmPassword}
                        />
                        {confirmPassword && (
                            <p className={`mt-1 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                {passwordsMatch ? '✓ As senhas coincidem' : '✗ As senhas não coincidem'}
                            </p>
                        )}
                    </div>

                    <div className="pt-4 border-t border-brand-gray-200">
                        <p className="text-xs text-brand-gray-500">
                            Dicas para uma senha forte:
                        </p>
                        <ul className="mt-2 space-y-1 text-xs text-brand-gray-600">
                            <li className="flex items-center gap-2">
                                <span className={newPassword.length >= 10 ? 'text-green-600' : 'text-brand-gray-400'}>•</span>
                                Pelo menos 10 caracteres
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-brand-gray-400'}>•</span>
                                Letras maiúsculas e minúsculas
                            </li>
                            <li className="flex items-center gap-2">
                                <span className={/[0-9]/.test(newPassword) ? 'text-green-600' : 'text-brand-gray-400'}>•</span>
                                Números
                            </li>
                        </ul>
                    </div>
                </div>
            </SettingsCard>

            {/* Two-Factor Authentication */}
            <SettingsCard 
                title="Autenticação de Dois Fatores" 
                description="Adicione uma camada extra de segurança à sua conta."
            >
                <div className="flex items-center justify-between p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <ShieldCheckIcon className="w-5 h-5 text-brand-blue-600" />
                            <h3 className="font-semibold text-brand-gray-800">2FA</h3>
                            {twoFactorEnabled && (
                                <span className="px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                    Ativo
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-brand-gray-600 mt-1">
                            {twoFactorEnabled 
                                ? 'Sua conta está protegida com autenticação de dois fatores' 
                                : 'Proteja sua conta com um código adicional no login'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)} 
                        className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${twoFactorEnabled ? 'bg-brand-blue-600' : 'bg-brand-gray-300'}`}
                    >
                        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>
            </SettingsCard>

            {/* Sessions */}
            <SettingsCard 
                title="Sessões Ativas" 
                description="Gerencie os dispositivos conectados à sua conta."
            >
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-brand-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-brand-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-brand-blue-600 font-semibold">💻</span>
                            </div>
                            <div>
                                <p className="font-medium text-brand-gray-800">Windows • Chrome</p>
                                <p className="text-xs text-brand-gray-500">São Paulo, Brasil • Agora</p>
                            </div>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                            Atual
                        </span>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
};

const SystemSettings = () => {
    const [maintenance, setMaintenance] = useState(false);
    const [autoApprove, setAutoApprove] = useState(false);
    const [maxFileSize, setMaxFileSize] = useState('10');
    const { showToast } = useToast();

    const handleSaveSystem = () => {
        showToast('Configurações do sistema atualizadas!', 'success');
    };

    return (
        <div className="space-y-6">
            <SettingsCard 
                title="Configurações do Sistema" 
                description="Ajustes globais que afetam todos os usuários do SIGRA."
                footer={
                    <button 
                        onClick={handleSaveSystem}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-all"
                    >
                        Salvar Configurações
                    </button>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🔧</span>
                                <h3 className="font-semibold text-brand-gray-800">Modo Manutenção</h3>
                            </div>
                            <p className="text-sm text-brand-gray-600 mt-1">
                                Impede o login de estudantes e exibe uma página de aviso. Administradores continuam com acesso.
                            </p>
                            {maintenance && (
                                <p className="text-xs text-yellow-700 mt-2 font-medium">
                                    ⚠️ Sistema em manutenção - apenas administradores podem acessar
                                </p>
                            )}
                        </div>
                        <button 
                            onClick={() => setMaintenance(!maintenance)} 
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${maintenance ? 'bg-yellow-600' : 'bg-brand-gray-300'}`}
                        >
                            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${maintenance ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                        <div className="flex-1">
                            <h3 className="font-medium text-brand-gray-800">Aprovação Automática de Matrículas</h3>
                            <p className="text-sm text-brand-gray-600 mt-0.5">
                                Novos estudantes são aprovados automaticamente sem revisão manual
                            </p>
                        </div>
                        <button 
                            onClick={() => setAutoApprove(!autoApprove)} 
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${autoApprove ? 'bg-brand-blue-600' : 'bg-brand-gray-300'}`}
                        >
                            <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${autoApprove ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className="p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                        <label htmlFor="maxFileSize" className="block font-medium text-brand-gray-800 mb-2">
                            Tamanho Máximo de Arquivo
                        </label>
                        <p className="text-sm text-brand-gray-600 mb-3">
                            Define o limite de tamanho para upload de arquivos no repositório
                        </p>
                        <div className="flex items-center gap-3">
                            <input 
                                type="range" 
                                id="maxFileSize"
                                min="1" 
                                max="50" 
                                value={maxFileSize}
                                onChange={(e) => setMaxFileSize(e.target.value)}
                                className="flex-1 h-2 bg-brand-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue-600"
                            />
                            <span className="text-sm font-semibold text-brand-gray-800 min-w-[60px] text-right">
                                {maxFileSize} MB
                            </span>
                        </div>
                    </div>
                </div>
            </SettingsCard>

            {/* System Stats */}
            <div className="bg-gradient-to-br from-brand-gray-50 to-brand-gray-100 rounded-2xl border border-brand-gray-200 p-6">
                <h3 className="text-lg font-semibold text-brand-gray-800 mb-4">Estatísticas do Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-brand-gray-200">
                        <p className="text-xs text-brand-gray-500 mb-1">Usuários Ativos</p>
                        <p className="text-2xl font-bold text-brand-gray-800">1,234</p>
                        <p className="text-xs text-green-600 mt-1">↑ 12% este mês</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-brand-gray-200">
                        <p className="text-xs text-brand-gray-500 mb-1">Arquivos no Sistema</p>
                        <p className="text-2xl font-bold text-brand-gray-800">5,678</p>
                        <p className="text-xs text-green-600 mt-1">↑ 8% este mês</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-brand-gray-200">
                        <p className="text-xs text-brand-gray-500 mb-1">Espaço Utilizado</p>
                        <p className="text-2xl font-bold text-brand-gray-800">2.4 GB</p>
                        <p className="text-xs text-brand-gray-500 mt-1">de 100 GB</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const AppearanceSettings = () => {
    const [theme, setTheme] = useState('light');
    const [compactMode, setCompactMode] = useState(false);
    const [animations, setAnimations] = useState(true);
    const { showToast } = useToast();

    const handleSaveAppearance = () => {
        showToast('Preferências de aparência salvas!', 'success');
    };

    return (
        <div className="space-y-6">
            <SettingsCard 
                title="Tema da Interface" 
                description="Escolha como você prefere visualizar o SIGRA."
                footer={
                    <button 
                        onClick={handleSaveAppearance}
                        className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-all"
                    >
                        Salvar Preferências
                    </button>
                }
            >
                <div className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-brand-gray-700 mb-3">Tema de Cores</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button 
                                onClick={() => setTheme('light')} 
                                className={`group p-5 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-brand-blue-500 bg-brand-blue-50' : 'border-brand-gray-200 hover:border-brand-gray-300'}`}
                            >
                                <div className="w-full h-24 bg-gradient-to-br from-white to-brand-gray-100 rounded-lg border border-brand-gray-200 mb-3 flex items-center justify-center">
                                    <div className="text-4xl">☀️</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-brand-gray-800">Claro</p>
                                    {theme === 'light' && (
                                        <CheckCircleIcon className="w-5 h-5 text-brand-blue-600" />
                                    )}
                                </div>
                                <p className="text-xs text-brand-gray-500 mt-1">Ideal para ambientes iluminados</p>
                            </button>
                            <button 
                                onClick={() => setTheme('dark')} 
                                className={`group p-5 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-brand-blue-500 bg-brand-blue-50' : 'border-brand-gray-200 hover:border-brand-gray-300'}`}
                            >
                                <div className="w-full h-24 bg-gradient-to-br from-brand-gray-800 to-brand-gray-900 rounded-lg border border-brand-gray-700 mb-3 flex items-center justify-center">
                                    <div className="text-4xl">🌙</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-brand-gray-800">Escuro</p>
                                    {theme === 'dark' && (
                                        <CheckCircleIcon className="w-5 h-5 text-brand-blue-600" />
                                    )}
                                </div>
                                <p className="text-xs text-brand-gray-500 mt-1">Reduz o cansaço visual</p>
                            </button>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-brand-gray-200 space-y-4">
                        <h3 className="text-sm font-semibold text-brand-gray-700">Preferências de Exibição</h3>
                        
                        <div className="flex items-center justify-between p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                            <div className="flex-1">
                                <h4 className="font-medium text-brand-gray-800">Modo Compacto</h4>
                                <p className="text-sm text-brand-gray-600 mt-0.5">Reduz o espaçamento entre elementos</p>
                            </div>
                            <button 
                                onClick={() => setCompactMode(!compactMode)} 
                                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${compactMode ? 'bg-brand-blue-600' : 'bg-brand-gray-300'}`}
                            >
                                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${compactMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-brand-gray-50 rounded-lg border border-brand-gray-200">
                            <div className="flex-1">
                                <h4 className="font-medium text-brand-gray-800">Animações</h4>
                                <p className="text-sm text-brand-gray-600 mt-0.5">Ativa transições e efeitos visuais</p>
                            </div>
                            <button 
                                onClick={() => setAnimations(!animations)} 
                                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${animations ? 'bg-brand-blue-600' : 'bg-brand-gray-300'}`}
                            >
                                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${animations ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </SettingsCard>
        </div>
    );
};

const NotificationSettings = () => {
    return (
        <SettingsCard 
            title="Notificações por Email" 
            description="Escolha quais notificações você deseja receber."
            footer={
                <button className="px-4 py-2 text-sm font-semibold text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700">
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
