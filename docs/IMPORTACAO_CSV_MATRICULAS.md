# Importação CSV de Matrículas

## Visão Geral

A funcionalidade de importação CSV permite que administradores validem múltiplas matrículas de uma só vez, comparando um arquivo CSV com as matrículas pendentes no sistema.

## Como Usar

1. Acesse a página **Validar Matrículas** (`/validate-enrollments`)
2. Clique no botão **Importar CSV** (visível apenas quando há matrículas pendentes)
3. Selecione um arquivo CSV contendo as matrículas a serem validadas
4. Clique em **Importar e Validar**
5. Visualize o resultado da importação

## Formato do Arquivo CSV

O arquivo CSV deve conter os números de matrícula, um por linha. O sistema aceita:

- **Separadores**: vírgula (`,`) ou ponto-e-vírgula (`;`)
- **Cabeçalho**: opcional (será ignorado se contiver texto)
- **Formato**: apenas números

### Exemplo 1: CSV Simples

```csv
202301
202302
202303
202304
202305
```

### Exemplo 2: CSV com Cabeçalho

```csv
matricula
202301
202302
202303
```

### Exemplo 3: CSV com Múltiplas Colunas

```csv
matricula,nome,curso
202301,João Silva,Engenharia
202302,Maria Santos,Medicina
202303,Pedro Oliveira,Direito
```

**Nota**: Quando há múltiplas colunas, o sistema extrai automaticamente a primeira coluna que contém apenas números.

## Comportamento do Sistema

### Matrículas Validadas ✅
- Matrículas que existem no sistema com status "pendente"
- São validadas automaticamente
- Usuários são criados com acesso ao sistema
- Notificações são enviadas aos novos usuários

### Matrículas Não Encontradas ⚠️
- Matrículas que não existem no sistema
- Matrículas que já foram processadas (validadas ou rejeitadas)
- Permanecem no arquivo mas não são processadas

### Erros ❌
- Matrículas que causaram erro durante a validação
- Detalhes do erro são exibidos no resultado

## Resultado da Importação

Após o processamento, o sistema exibe:

1. **Quantidade de matrículas validadas** com lista completa
2. **Quantidade de matrículas não encontradas** com lista completa
3. **Erros ocorridos** (se houver) com detalhes

## Exemplo de Uso

### Cenário
Você tem 100 matrículas pendentes no sistema e recebe um arquivo CSV com 50 matrículas aprovadas pelo departamento acadêmico.

### Processo
1. Faça upload do arquivo CSV
2. O sistema compara as 50 matrículas do CSV com as 100 pendentes
3. Valida automaticamente as que coincidem
4. Exibe resultado:
   - 45 validadas (estavam pendentes)
   - 5 não encontradas (já processadas ou não existem)

### Resultado
- As 45 matrículas são validadas automaticamente
- Usuários são criados e podem fazer login
- As 50 matrículas restantes continuam pendentes para revisão manual

## Vantagens

- **Eficiência**: Valida múltiplas matrículas de uma vez
- **Segurança**: Apenas matrículas pendentes são processadas
- **Transparência**: Resultado detalhado de cada operação
- **Flexibilidade**: Aceita diferentes formatos de CSV

## Arquivo de Exemplo

Um arquivo de exemplo está disponível em: `docs/exemplo-importacao-matriculas.csv`
