# Sistema de Autenticação SIGRA

## Visão Geral

O sistema de autenticação do SIGRA foi completamente refatorado para fornecer:

1. **Persistência de Sessão** - O usuário permanece logado mesmo após recarregar a página
2. **Segurança Aprimorada** - Uso de Context API e proteção de rotas
3. **Expiração de Sessão** - Sessões expiram após 7 dias de inatividade
4. **Auto-login** - Restauração automática da sessão ao recarregar
5. **Proteção de Rotas** - Rotas protegidas por role (Admin/Student)

## Arquitetura

### 1. AuthContext (`contexts/AuthContext.tsx`)

O contexto de autenticação gerencia todo o estado de autenticação da aplicação:

```typescript
interface AuthContextType {
  currentUser: User | null;      // Usuário atual autenticado
  loading: boolean;               // Estado de carregamento
  login: (email, password) => Promise<void>;  // Função de login
  logout: () => void;             // Função de logout
  updateUser: (user) => void;     // Atualizar dados do usuário
}
```

**Funcionalidades:**

- **Persistência**: Salva sessão no `localStorage` com chave `sigra_session`
- **Expiração**: Sessões expiram após 7 dias (configurável)
- **Restauração**: Ao carregar a aplicação, verifica se há sessão válida
- **Limpeza**: Remove dados ao fazer logout ou quando sessão expira

### 2. ProtectedRoute (`components/ProtectedRoute.tsx`)

Componente que protege rotas baseado em autenticação e roles:

```typescript
<ProtectedRoute allowedRoles={[Role.Admin]}>
  <AdminPage />
</ProtectedRoute>
```

**Comportamento:**

- Mostra loading enquanto verifica autenticação
- Redireciona para `/login` se não autenticado
- Redireciona para `/dashboard` se não tem permissão
- Renderiza componente se tudo OK

### 3. LoginPage Atualizado

A página de login agora usa o `useAuth` hook:

```typescript
const { login } = useAuth();

await login(email, password);
navigate('/dashboard');
```

**Melhorias:**

- Não precisa mais de prop `onLogin`
- Usa `useNavigate` para redirecionamento
- Checkbox "Manter conectado" funcional
- Tratamento de erros melhorado

### 4. App.tsx Refatorado

O App agora usa `AuthProvider` e `ProtectedRoute`:

```typescript
<AuthProvider>
  <AppContent />
</AuthProvider>
```

**Mudanças:**

- Removido gerenciamento manual de `currentUser`
- Usa `useAuth()` para acessar estado de autenticação
- Rotas protegidas com `<ProtectedRoute>`
- Logout integrado com contexto

## Fluxo de Autenticação

### Login

1. Usuário preenche email e senha
2. `LoginPage` chama `login()` do contexto
3. Contexto chama `authService.login()`
4. Se sucesso, salva sessão no localStorage
5. Atualiza estado `currentUser`
6. Redireciona para `/dashboard`

### Restauração de Sessão

1. App carrega e `AuthContext` inicializa
2. Verifica se existe `sigra_session` no localStorage
3. Verifica se sessão não expirou
4. Se válida, restaura `currentUser`
5. Se expirada, limpa dados e mostra login

### Logout

1. Usuário clica em "Sair"
2. `handleLogout()` chama `authLogout()` do contexto
3. Contexto limpa localStorage
4. Atualiza `currentUser` para `null`
5. Usuário é redirecionado para login

### Proteção de Rotas

1. Usuário tenta acessar rota protegida
2. `ProtectedRoute` verifica se está autenticado
3. Verifica se tem role necessário
4. Se não, redireciona apropriadamente
5. Se sim, renderiza componente

## Segurança

### O que está protegido:

✅ Sessões expiram automaticamente após 7 dias
✅ Dados de sessão armazenados localmente (não em cookies)
✅ Verificação de role antes de renderizar rotas
✅ Logout limpa todos os dados de sessão
✅ Senhas nunca armazenadas no frontend
✅ Autenticação via Supabase com bcrypt

### O que ainda pode ser melhorado:

⚠️ Adicionar refresh token para renovar sessões
⚠️ Implementar rate limiting no backend
⚠️ Adicionar 2FA (autenticação de dois fatores)
⚠️ Criptografar dados no localStorage
⚠️ Implementar CSRF protection
⚠️ Adicionar audit log de logins

## Configuração

### Duração da Sessão

Para alterar a duração da sessão, edite `AuthContext.tsx`:

```typescript
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias
```

### Chaves do localStorage

```typescript
const SESSION_KEY = 'sigra_session';
const SESSION_EXPIRY_KEY = 'sigra_session_expiry';
```

## Uso

### Acessar usuário atual em qualquer componente:

```typescript
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { currentUser, logout } = useAuth();
  
  return (
    <div>
      <p>Olá, {currentUser?.name}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};
```

### Proteger uma rota:

```typescript
<Route path="/admin" element={
  <ProtectedRoute allowedRoles={[Role.Admin]}>
    <AdminPage />
  </ProtectedRoute>
} />
```

### Atualizar dados do usuário:

```typescript
const { updateUser } = useAuth();

const handleUpdate = async () => {
  const updatedUser = { ...currentUser, name: 'Novo Nome' };
  updateUser(updatedUser);
};
```

## Troubleshooting

### Usuário faz logout ao recarregar página

- Verifique se o localStorage está habilitado no navegador
- Verifique se não há erro no console ao restaurar sessão
- Confirme que `SESSION_KEY` está correto

### Sessão expira muito rápido

- Aumente `SESSION_DURATION` em `AuthContext.tsx`
- Verifique se o relógio do sistema está correto

### Rotas não protegidas corretamente

- Confirme que `ProtectedRoute` está envolvendo o componente
- Verifique se `allowedRoles` está correto
- Confirme que `currentUser.role` tem o valor esperado

## Migração do Sistema Antigo

### Antes:
```typescript
const [currentUser, setCurrentUser] = useState<User | null>(null);
const handleLogin = (user: User) => setCurrentUser(user);
<LoginPage onLogin={handleLogin} />
```

### Depois:
```typescript
<AuthProvider>
  <LoginPage />
</AuthProvider>

// Em qualquer componente:
const { currentUser } = useAuth();
```

## Próximos Passos

1. ✅ Implementar persistência de sessão
2. ✅ Adicionar proteção de rotas por role
3. ✅ Auto-login ao recarregar página
4. ⏳ Implementar refresh tokens
5. ⏳ Adicionar 2FA
6. ⏳ Implementar "Esqueci minha senha"
7. ⏳ Adicionar audit log de acessos
8. ⏳ Implementar rate limiting

## Conclusão

O novo sistema de autenticação fornece uma base sólida e segura para o SIGRA, com persistência de sessão, proteção de rotas e melhor experiência do usuário. O código é mais limpo, manutenível e segue as melhores práticas do React.
