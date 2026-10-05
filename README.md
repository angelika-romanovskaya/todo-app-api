# ToDo List + API на Redux Toolkit (createAsyncThunk)

Полноценное ToDo-приложение с серверным API `todo-redev`: авторизация,
загрузка, создание, изменение, удаление, фильтрация и очистка выполненных
задач. Всё состояние — в Redux store, все сетевые операции — через
`createAsyncThunk`.

Работает в архитектуре **Feature-Sliced Design (FSD)**.

---

## Содержание

1. [Стек](#стек)
2. [Команды запуска](#команды-запуска)
3. [Переменные окружения](#переменные-окружения)
4. [Структура проекта (FSD)](#структура-проекта-fsd)
5. [Структура state](#структура-state)
6. [Flow createAsyncThunk](#flow-createasyncthunk)
7. [Список thunk'ов](#список-thunkов)
8. [API endpoints](#api-endpoints)
9. [Блокировка повторных запросов](#блокировка-повторных-запросов)
10. [Фильтрация — клиентская](#фильтрация--клиентская)
11. [Авторизация и регистрация](#авторизация-и-регистрация)
12. [Типичные ошибки](#типичные-ошибки)
13. [Чек-лист проверки](#чек-лист-проверки)

---

## Стек

- React 18
- `@reduxjs/toolkit`
- `react-redux`
- TypeScript
- Vite
- Ant Design
- react-router-dom
- i18next

---

## Команды запуска

```bash
npm install
npm run dev       # dev-сервер (Vite)
npm run build     # production-сборка
npm run preview   # предпросмотр собранного билда
```

---

## Переменные окружения

В корне проекта — файл `.env`:

```
VITE_API_URL=https://todo-redev.herokuapp.com/api
```

Типы переменных описаны в `src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

В `vite.config.ts` для `base` используется `loadEnv` (не `import.meta.env`):

```ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: env.VITE_BASE_URL || '/',
    // ...
  };
});
```

---

## Структура проекта (FSD)

```
src/
├── app/                          # инициализация приложения
│   ├── providers/
│   │   ├── StoreProvider/        # <Provider store={store}>
│   │   └── ThemeProvider/        # тема (контекст, не Redux)
│   ├── hooks.ts                  # useAppSelector / useAppDispatch
│   ├── store.ts                  # configureStore
│   ├── App.tsx
│   └── index.ts
├── pages/                        # страницы
│   ├── LoginPage/
│   ├── RegisterPage/
│   └── TodosPage/
├── widgets/                      # композиция фич
│   ├── TodoWidget/
│   └── Header/
├── features/                     # пользовательские сценарии
│   ├── Auth/
│   │   ├── model/
│   │   │   ├── authSlice.ts
│   │   │   └── thunks.ts         # login / register / logout
│   │   └── ui/
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       └── LogoutButton.tsx
│   ├── AddTodo/
│   ├── FilterTodos/
│   ├── ClearCompleted/
│   ├── ToggleTodo/
│   └── DeleteTodo/
├── entities/                     # бизнес-сущности
│   └── Todo/
│       ├── model/
│       │   ├── todoSlice.ts      # slice задач
│       │   ├── filterSlice.ts    # slice фильтра
│       │   ├── thunks.ts         # fetchTodos / createTodo / update / toggle / delete / clear
│       │   ├── selectors.ts      # createSelector
│       │   └── types.ts
│       ├── ui/
│       │   ├── TodoList.tsx
│       │   ├── TodoItem.tsx
│       │   └── EmptyState.tsx
│       └── index.ts              # публичный API
├── shared/                       # переиспользуемое
│   ├── api/client.ts             # fetch-обёртка с токеном
│   ├── config/constants.ts       # FILTER_TYPES, STORAGE_KEYS
│   └── lib/
│       ├── localStorage.ts
│       └── validation.ts
└── main.tsx
```

Слои импортируются **только сверху вниз**:
`app → pages → widgets → features → entities → shared`.

---

## Структура state

Store собирается в `src/app/store.ts`:

```ts
export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
    filter: filterReducer,
  },
});
```

Полная структура:

```ts
{
  auth: {
    token: string | null;         // access_token из API
    user: { email: string; name?: string } | null;
    loading: boolean;             // true во время login/register
    initialized: boolean;         // (опц.) завершена ли проверка токена при старте
    error: string | null;
  },

  todos: {
    items: ITodo[];               // актуальный список задач с сервера
    loading: boolean;             // true во время ЛЮБОЙ операции с задачами
    error: string | null;         // последняя ошибка операции
  },

  filter: {
    value: 'all' | 'active' | 'completed';  // только UI-состояние
  },
}
```

### Что где хранится

| Поле | Источник | Комментарий |
|---|---|---|
| `auth.token` | `POST /auth/login` → `access_token` | Источник правды для авторизации, синхронизирован с `localStorage` |
| `auth.user` | `login` / `register` payload | Для отображения в шапке |
| `auth.loading` | login/register thunk'и | Блокирует кнопки в формах |
| `todos.items` | `GET /todos` → `response.data` | **Единственный** источник правды для списка |
| `todos.loading` | все todos-thunk'и | Общий флаг, блокирует кнопки/инпуты |
| `todos.error` | все todos-thunk'и | Строка, показывается через `TodoList` |
| `filter.value` | `setFilter` reducer | **Не хранит задачи**, только выбранный фильтр |

### Что НЕ хранится в state

- **Производные данные** (`filteredTodos`, `stats`) — считаются через `createSelector` в `selectors.ts`.
- **Задачи в компонентах** — только в `todos.items`. Локальный `useState` в компонентах — исключительно UI-черновики (`editText`, `isEditing`).
- **Тема** (`isDark`) — в `ThemeProvider`, это UI-настройка, не бизнес-данные.

### Формат ответа API

`todo-redev` возвращает список **в обёртке**:

```json
{
  "data": [ { "id": 1, "title": "...", "isCompleted": false, ... } ],
  "meta": { "total": 1, "page": 1, "limit": 10, "totalPages": 1 }
}
```

Thunk `fetchTodos` извлекает **только `response.data`**, чтобы в `state.todos.items` всегда лежал массив, а не объект `{ data, meta }`.

В `selectTodos` стоит страховка:

```ts
export const selectTodos = (state: RootState): ITodo[] =>
  Array.isArray(state.todos.items) ? state.todos.items : EMPTY_TODOS;
```

Это гарантирует, что селектор никогда не упадёт, даже если формат ответа API изменится.

---

## Flow createAsyncThunk

Все сетевые операции идут через `createAsyncThunk`. Никаких `fetch` в компонентах.

### Общий паттерн

```
   dispatch(thunk(payload))
        │
        ▼
   ┌─────────────┐
   │   pending   │  →  slice ставит loading = true, error = null
   └─────────────┘
        │
        ▼
   async-функция thunk'а:
     1. getToken(getState())        — берём актуальный токен из auth
     2. apiRequest(path, { token }) — делаем запрос
     3. Сервер вернул { data, meta } — извлекаем .data
     4. Возврат данных → fulfilled
        ИЛИ
        catch → return rejectWithValue(message) → rejected
        │
   ┌────┴────┐
   ▼         ▼
fulfilled  rejected
   │         │
   ▼         ▼
slice обновляет items        slice ставит error
ответом сервера               (loading = false)
```

### Ключевые решения

**1. Токен берётся внутри thunk'а, а не через проп.**

```ts
const getToken = (state: RootState) => state.auth.token;
// ...
token: getToken(getState())
```

Компоненты не знают про авторизацию. Если завтра токен переедет в другое поле — правится только thunk.

**2. Ответы API обёрнуты в `{ data }` — thunk извлекает `data`.**

```ts
const response = await apiRequest<TodosResponse>('/todos', { token });
return response.data;
```

Если вернуть весь ответ — в `state.todos.items` попадёт объект, и `.filter/.map` упадут с `is not a function`.

**3. Ошибки → `rejectWithValue(message)`.**

Не `throw` (тогда `error` был бы `SerializedError` с неудобным сообщением), а именно `return rejectWithValue(...)` — в slice приходит **готовая строка**.

**4. После `fulfilled` store принимает ответ сервера, а не «оптимистичную» прикидку.**

Задание требовало: «после успешной операции store отражает актуальное состояние сервера». Поэтому мы ждём ответ и обновляем `items` тем, что реально вернул сервер.

### Схема для списка задач

```
GET /todos          →  fetchTodos         →  items = response.data
POST /todos         →  createTodo         →  items.unshift(response.data)
PATCH /todos/:id    →  updateTodoText     →  items[idx] = response.data
PATCH /todos/:id    →  toggleTodoStatus   →  items[idx] = response.data
DELETE /todos/:id   →  deleteTodo         →  items.filter(t => t.id !== id)
DELETE /todos/:id×N →  clearCompleted     →  items.filter(t => !removed.has(t.id))
```

---

## Список thunk'ов

| Thunk | Endpoint | Payload | Возвращает | Slice в `fulfilled` |
|---|---|---|---|---|
| `login` | `POST /auth/login` | `{ email, password }` | `{ token, email }` | `auth.token`, `auth.user`; `localStorage` |
| `register` | `POST /auth/register` + `POST /auth/login` | `{ email, password, name }` | `{ token, email, name }` | То же |
| `logout` | — | — | — | Сбрасывает `auth`; чистит `localStorage` |
| `fetchTodos` | `GET /todos` | — | `ITodo[]` (`response.data`) | `todos.items = payload` |
| `createTodo` | `POST /todos` | `{ title, description }` | `ITodo` (`response.data`) | `items.unshift(payload)` |
| `updateTodoText` | `PATCH /todos/:id` | `{ id, title, description }` | `ITodo` (`response.data`) | Замена элемента по `id` |
| `toggleTodoStatus` | `PATCH /todos/:id` | `{ id, isCompleted }` | `ITodo` (`response.data`) | Замена элемента по `id` |
| `deleteTodo` | `DELETE /todos/:id` | `number` (id) | `number` (id) | `items.filter(t => t.id !== id)` |
| `clearCompleted` | `DELETE /todos/:id` × N | — | `number[]` (ids) | `items.filter(t => !removed.has(t.id))` |

### Почему `deleteTodo` возвращает `id`

Чтобы в `fulfilled` точно знать, что удалить, без гонки:

```ts
.addCase(deleteTodo.fulfilled, (state, action) => {
  state.items = state.items.filter((t) => t.id !== action.payload);
});
```

### Почему `clearCompleted` возвращает массив id

API не имеет batch-эндпоинта — удаляем параллельно через `Promise.all`. Возврат ids позволяет в `fulfilled` **точно** знать, что удалилось:

```ts
const removed = new Set(action.payload);
state.items = state.items.filter((t) => !removed.has(t.id));
```

Если бы фильтровали просто по `!isCompleted`, могли бы «снести» задачу, которую пользователь пометил выполненной уже **после** отправки запроса.

### Почему `toggleTodoStatus` принимает `isCompleted`, а не «переключает» сам

Идемпотентность и устойчивость к гонкам:

```ts
dispatch(toggleTodoStatus({ id: todo.id, isCompleted: !todo.isCompleted }));
```

Компонент знает актуальное значение из пропса, thunk применяет именно его. Если бы thunk сам инвертировал, а параллельно пришёл refetch — можно было бы поставить не то.

---

## API endpoints

База: `VITE_API_URL` (например, `https://todo-redev.herokuapp.com/api`).

| Метод | URL | Назначение | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Регистрация `{ email, password, name }` | — |
| `POST` | `/auth/login` | Логин `{ email, password }` → `{ access_token }` | — |
| `GET` | `/todos` | Список задач → `{ data, meta }` | ✅ |
| `POST` | `/todos` | Создать `{ title, description }` → `{ data }` | ✅ |
| `PATCH` | `/todos/:id` | Обновить `{ title?, description?, isCompleted? }` → `{ data }` | ✅ |
| `DELETE` | `/todos/:id` | Удалить → `204 No Content` | ✅ |

Авторизация — `Authorization: Bearer <access_token>`. Устанавливается в `shared/api/client.ts` автоматически, если thunk передал `token`.

---

## Блокировка повторных запросов

Каждый `pending` ставит `loading = true`, каждый `fulfilled`/`rejected` — сбрасывает. Компоненты:

- читают `loading` через `useAppSelector((s) => s.todos.loading)`;
- передают в `disabled` кнопок и инпутов;
- используют `okButtonProps={{ loading }}` в `Popconfirm`;
- в `useEffect`-редиректе ждут обновления store, а не вызывают `navigate` прямо в `onFinish`.

Пока запрос в полёте — повторный клик физически невозможен.

> ⚠️ Для сложного UI (`loading` блокирует **все** операции) можно развести флаги: `creating`, `updating`, `deleting`, `pendingIds: number[]`. Для текущего todo-приложения общего `loading` достаточно.

---

## Фильтрация — клиентская

Клик по фильтру вызывает **только** `dispatch(setFilter('active'))`. Никаких thunk'ов, никаких запросов к API. Фильтрация выполняется в `selectFilteredTodos` (`createSelector`) по уже загруженным `items`.

```ts
export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.isCompleted);
      case 'completed':
        return todos.filter((t) => t.isCompleted);
      default:
        return todos;
    }
  },
);
```

Проверить: DevTools → Network, пощёлкать по фильтрам — записей быть не должно.

---

## Авторизация и регистрация

### Регистрация делает два запроса

`/auth/register` в `todo-redev` возвращает **данные пользователя**, но **не токен**. Токен выдаёт только `/auth/login`. Поэтому thunk `register`:

1. Создаёт пользователя (`POST /auth/register`).
2. Сразу логинится тем же email/паролем (`POST /auth/login`).
3. Возвращает `access_token`.

Наружу это невидимо — компонент `RegisterForm` вызывает `dispatch(register(values))` и получает тот же результат, что и `login`.

### Токен — `access_token`

API возвращает `{ access_token }`, а не `{ token }`. Thunk читает именно это поле:

```ts
const { access_token } = await apiRequest<AuthResponse>('/auth/login', ...);
localStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
return { token: access_token, email: payload.email };
```

Наружу из thunk'а уходит уже `token` — остальной код не зависит от имени поля в API.

### Редирект после логина/регистрации

Редирект делается через `useEffect` по `token`, а не прямо в `onFinish`:

```tsx
useEffect(() => {
  if (token) navigate('/', { replace: true });
}, [token, navigate]);
```

Иначе `ProtectedRoute` на странице назначения может увидеть старое (пустое) состояние и отбросить пользователя обратно на `/login`. С `useEffect` — редирект гарантированно после обновления store.

---
