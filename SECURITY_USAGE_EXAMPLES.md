# Guia de Uso - Componentes de Segurança

Este documento mostra como usar os componentes e hooks de segurança implementados no SIGRA.

## 1. Hook usePermissions

Verifica permissões do usuário para controlar UI.

```tsx
import { usePermissions } from './src/hooks/usePermissions';

function MyComponent() {
  const { isAdmin, isStudent, canEdit, canDelete } = usePermissions();

  return (
    <div>
      {isAdmin && <button>Ação Admin</button>}
      
      {canEdit(file.userId) && <button>Editar</button>}
      
      {canDelete(file.userId) && <button>Deletar</button>}
    </div>
  );
}
```

## 2. Componente PermissionGate

Oculta elementos baseado em permissões.

```tsx
import PermissionGate from './components/PermissionGate';
import { Role } from './types';

function MyComponent() {
  return (
    <div>
      {/* Apenas admins veem */}
      <PermissionGate allowedRoles={[Role.Admin]}>
        <button>Deletar Usuário</button>
      </PermissionGate>

      {/* Admin ou dono do arquivo veem */}
      <PermissionGate resourceOwnerId={file.userId} allowOwner>
        <button>Editar Arquivo</button>
      </PermissionGate>

      {/* Com fallback */}
      <PermissionGate 
        allowedRoles={[Role.Admin]}
        fallback={<p>Você não tem permissão</p>}
      >
        <AdminPanel />
      </PermissionGate>
    </div>
  );
}
```

## 3. ProtectedRoute

Protege rotas por role (já implementado no App.tsx).

```tsx
import ProtectedRoute from './components/ProtectedRoute';
import { Role } from './types';

// No App.tsx
<Route path="admin-panel" element={
  <ProtectedRoute allowedRoles={[Role.Admin]}>
    <AdminPanel />
  </ProtectedRoute>
} />

// Com redirect customizado
<Route path="settings" element={
  <ProtectedRoute 
    allowedRoles={[Role.Admin]} 
    redirectTo="/dashboard"
  >
    <Settings />
  </ProtectedRoute>
} />
```

## 4. Validação de Inputs

Sanitiza e valida inputs antes de enviar ao backend.

```tsx
import { 
  sanitizeString, 
  isValidEmail, 
  isValidMatricula,
  isStrongPassword 
} from './src/utils/inputValidation';

function UserForm() {
  const handleSubmit = (data) => {
    // Sanitizar strings
    const safeName = sanitizeString(data.name);
    
    // Validar email
    if (!isValidEmail(data.email)) {
      alert('Email inválido');
      return;
    }
    
    // Validar matrícula
    if (!isValidMatricula(data.matricula)) {
      alert('Matrícula deve conter apenas letras e números');
      return;
    }
    
    // Validar senha
    if (!isStrongPassword(data.password)) {
      alert('Senha deve ter 8+ caracteres, maiúsculas, minúsculas e números');
      return;
    }
    
    // Enviar dados sanitizados
    api.createUser({ ...data, name: safeName });
  };
}
```

## 5. Componente SecureInput

Input com sanitização e validação automática.

```tsx
import SecureInput from './components/SecureInput';

function MyForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  return (
    <form>
      {/* Input com validação de email */}
      <SecureInput
        type="email"
        validationType="email"
        onChange={setEmail}
        showValidation
        placeholder="seu@email.com"
        className="w-full px-4 py-2 border rounded"
      />

      {/* Input com sanitização */}
      <SecureInput
        type="text"
        sanitize
        onChange={setName}
        placeholder="Seu nome"
        className="w-full px-4 py-2 border rounded"
      />
    </form>
  );
}
```

## 6. Componente SecureFileUpload

Upload de arquivo com validações de tipo e tamanho.

```tsx
import SecureFileUpload from './components/SecureFileUpload';

function UploadForm() {
  const handleFileSelect = (file: File) => {
    console.log('Arquivo válido:', file);
    // Enviar para backend
    uploadFile(file);
  };

  return (
    <SecureFileUpload
      onFileSelect={handleFileSelect}
      accept=".pdf,.doc,.docx"
      maxSize={5 * 1024 * 1024} // 5MB
    />
  );
}
```

## 7. Hook useDebounce

Previne excesso de requisições (rate limiting no frontend).

```tsx
import { useDebounce } from './src/hooks/useDebounce';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    // Só faz busca quando usuário parar de digitar por 500ms
    if (debouncedSearch) {
      searchAPI(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Buscar..."
    />
  );
}
```

## 8. Validação de Arquivos

```tsx
import { 
  validateFile, 
  formatFileSize,
  sanitizeFileName 
} from './src/utils/inputValidation';

function handleFileUpload(file: File) {
  // Validar arquivo
  const validation = validateFile(file);
  if (!validation.valid) {
    alert(validation.error);
    return;
  }

  // Sanitizar nome
  const safeName = sanitizeFileName(file.name);
  
  // Mostrar tamanho formatado
  console.log(`Arquivo: ${safeName} (${formatFileSize(file.size)})`);
  
  // Upload
  uploadFile(file);
}
```

## Resumo de Segurança

### Frontend (UI/UX)
- ✅ `usePermissions`: Controla visibilidade de elementos
- ✅ `PermissionGate`: Oculta componentes por role
- ✅ `ProtectedRoute`: Protege rotas por role
- ✅ `SecureInput`: Sanitiza inputs automaticamente
- ✅ `SecureFileUpload`: Valida tipo e tamanho de arquivos
- ✅ `useDebounce`: Rate limiting no frontend

### Backend (Supabase)
- ✅ RLS (Row Level Security): Garante que usuários só acessem seus dados
- ✅ Políticas de acesso: Admins podem tudo, estudantes apenas seus recursos
- ✅ Validações no banco: Check constraints e foreign keys

### Fluxo de Segurança
1. **Frontend valida** → Feedback imediato ao usuário
2. **Backend valida** → Segurança real (RLS do Supabase)
3. **Ambos trabalham juntos** → Melhor UX + Segurança garantida
