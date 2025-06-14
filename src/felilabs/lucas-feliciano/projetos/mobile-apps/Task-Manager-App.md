# Task Manager Mobile App

Um aplicativo multiplataforma para gerenciamento de tarefas.

## Plataforma

- **React Native** - Framework principal
- **Expo SDK 49** - Ferramentas de desenvolvimento
- **TypeScript** - Tipagem estática

## Funcionalidades

### Core Features
- Arquitetura offline-first
- Notificações push
- Integração com calendário
- Colaboração em equipe
- Anexos de arquivos

### Sincronização
- **Local**: SQLite
- **Remoto**: Firebase Firestore
- **Sync**: Atualizações em tempo real

## Arquitetura

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Telas da aplicação
├── navigation/     # Configuração de navegação
├── services/       # Serviços e APIs
├── store/          # Gerenciamento de estado
├── utils/          # Funções utilitárias
└── types/          # Definições TypeScript
```

## Estado da Aplicação

Utilizamos **Redux Toolkit** para gerenciamento de estado:

```typescript
interface AppState {
  tasks: Task[];
  projects: Project[];
  user: User | null;
  sync: SyncStatus;
}
```

## Offline-First

O app funciona completamente offline com sincronização automática:

1. **Armazenamento Local**: SQLite para dados críticos
2. **Queue de Sync**: Ações pendentes são enfileiradas
3. **Resolução de Conflitos**: Merge inteligente de dados
4. **Indicadores**: Status visual de conectividade

## Notificações

Sistema completo de notificações:
- Lembretes de tarefas
- Atualizações de equipe
- Deadlines próximos
- Conquistas e marcos

## Performance

### Otimizações
- Lazy loading de telas
- Virtualização de listas
- Cache de imagens
- Debounce em buscas

### Métricas
- Tempo de inicialização < 2s
- Uso de memória otimizado
- Bateria eficiente
- Tamanho do bundle minimizado

Construído com foco na produtividade e experiência do usuário.