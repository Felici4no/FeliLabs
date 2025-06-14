# TypeScript - Conceitos Avançados

## Utility Types

### Partial&lt;T&gt;
Torna todas as propriedades opcionais:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; }

// Uso prático
function updateUser(id: number, updates: PartialUser) {
  // Permite atualizar apenas campos específicos
}
```

### Pick&lt;T, K&gt;
Cria um tipo selecionando propriedades específicas:

```typescript
type UserContact = Pick<User, 'name' | 'email'>;
// { name: string; email: string; }

type UserIdentity = Pick<User, 'id'>;
// { id: number; }
```

### Omit&lt;T, K&gt;
Cria um tipo excluindo propriedades específicas:

```typescript
type CreateUser = Omit<User, 'id'>;
// { name: string; email: string; }
```

### Record&lt;K, T&gt;
Cria um tipo com chaves específicas:

```typescript
type UserRoles = Record<string, boolean>;
// { [key: string]: boolean; }

type StatusMap = Record<'pending' | 'approved' | 'rejected', string>;
// { pending: string; approved: string; rejected: string; }
```

## Conditional Types

```typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

type StringResponse = ApiResponse<string>;
// { message: string; }

type ObjectResponse = ApiResponse<User>;
// { data: User; }
```

### Conditional Types Avançados

```typescript
// Extrair tipos de arrays
type ArrayElement<T> = T extends (infer U)[] ? U : never;

type StringArray = string[];
type Element = ArrayElement<StringArray>; // string

// Extrair tipos de funções
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser(): User { /* ... */ }
type UserType = ReturnType<typeof getUser>; // User
```

## Template Literal Types

```typescript
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// Combinações mais complexas
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/posts' | '/comments';
type APIRoute = `${HTTPMethod} ${Endpoint}`;
// 'GET /users' | 'POST /users' | ... etc
```

## Mapped Types

```typescript
// Tornar todas as propriedades readonly
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Tornar todas as propriedades opcionais
type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Adicionar prefixo às chaves
type Prefixed<T, P extends string> = {
  [K in keyof T as `${P}${string & K}`]: T[K];
};

type PrefixedUser = Prefixed<User, 'user_'>;
// { user_id: number; user_name: string; user_email: string; }
```

## Discriminated Unions

```typescript
interface LoadingState {
  status: 'loading';
}

interface SuccessState {
  status: 'success';
  data: any;
}

interface ErrorState {
  status: 'error';
  error: string;
}

type AsyncState = LoadingState | SuccessState | ErrorState;

// Type guards automáticos
function handleState(state: AsyncState) {
  switch (state.status) {
    case 'loading':
      // TypeScript sabe que é LoadingState
      break;
    case 'success':
      // TypeScript sabe que tem 'data'
      console.log(state.data);
      break;
    case 'error':
      // TypeScript sabe que tem 'error'
      console.log(state.error);
      break;
  }
}
```

## Type Guards

### Predicate Functions

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isUser(obj: any): obj is User {
  return obj && 
         typeof obj.id === 'number' &&
         typeof obj.name === 'string' &&
         typeof obj.email === 'string';
}

// Uso
function processValue(value: unknown) {
  if (isString(value)) {
    // TypeScript sabe que value é string
    console.log(value.toUpperCase());
  }
}
```

### Assertion Functions

```typescript
function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error('Expected number');
  }
}

function processNumber(value: unknown) {
  assertIsNumber(value);
  // TypeScript sabe que value é number após a assertion
  return value * 2;
}
```

## Padrões Avançados

### Builder Pattern

```typescript
class QueryBuilder<T> {
  private conditions: string[] = [];
  
  where(condition: string): QueryBuilder<T> {
    this.conditions.push(condition);
    return this;
  }
  
  select<K extends keyof T>(fields: K[]): QueryBuilder<Pick<T, K>> {
    // Retorna um builder com tipo mais específico
    return this as any;
  }
  
  build(): string {
    return `SELECT * FROM table WHERE ${this.conditions.join(' AND ')}`;
  }
}

// Uso com tipos seguros
const query = new QueryBuilder<User>()
  .where('age > 18')
  .select(['name', 'email'])
  .build();
```

### Fluent API

```typescript
interface FluentAPI<T> {
  filter(predicate: (item: T) => boolean): FluentAPI<T>;
  map<U>(transform: (item: T) => U): FluentAPI<U>;
  take(count: number): FluentAPI<T>;
  toArray(): T[];
}

class FluentArray<T> implements FluentAPI<T> {
  constructor(private items: T[]) {}
  
  filter(predicate: (item: T) => boolean): FluentAPI<T> {
    return new FluentArray(this.items.filter(predicate));
  }
  
  map<U>(transform: (item: T) => U): FluentAPI<U> {
    return new FluentArray(this.items.map(transform));
  }
  
  take(count: number): FluentAPI<T> {
    return new FluentArray(this.items.slice(0, count));
  }
  
  toArray(): T[] {
    return [...this.items];
  }
}
```

## Melhores Práticas

### 1. Use Strict Mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true
  }
}
```

### 2. Prefira Interfaces para Object Shapes
```typescript
// ✅ Bom
interface User {
  id: number;
  name: string;
}

// ❌ Evite para object shapes
type User = {
  id: number;
  name: string;
}
```

### 3. Use Const Assertions
```typescript
// ✅ Bom - tipo literal
const colors = ['red', 'green', 'blue'] as const;
type Color = typeof colors[number]; // 'red' | 'green' | 'blue'

// ❌ Tipo muito amplo
const colors = ['red', 'green', 'blue']; // string[]
```

### 4. Leverage Utility Types
```typescript
// ✅ Reutilize tipos existentes
type CreateUserRequest = Omit<User, 'id'>;
type UpdateUserRequest = Partial<CreateUserRequest>;

// ❌ Duplicação desnecessária
type CreateUserRequest = {
  name: string;
  email: string;
}
```

### 5. Use Generic Constraints
```typescript
// ✅ Constrains genéricos
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// ❌ Muito permissivo
function getProperty<T>(obj: T, key: string): any {
  return (obj as any)[key];
}
```

TypeScript oferece um sistema de tipos extremamente poderoso que, quando usado corretamente, pode prevenir muitos bugs e tornar o código mais maintível e autodocumentado.