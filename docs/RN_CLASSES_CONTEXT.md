# Documentación de Clases — React Native con Expo

> Generado a partir de 3 clases de la materia. Contiene **únicamente** librerías, hooks, patrones y APIs autorizadas para usar en el proyecto.

---

> ⚠️ **INSTRUCCIONES PARA CLAUDE CODE — GESTIÓN DE LIBRERÍAS**
>
> 1. **Librería nueva (no está en este documento):** no la instales. Preguntale primero al usuario si la quiere incorporar al proyecto.
> 2. **Librería de este documento (no está en el proyecto):** no la instales automáticamente. Preguntale al usuario si la quiere agregar antes de proceder.
> 3. **Gestor de paquetes:** el proyecto usa **`pnpm`** exclusivamente. Nunca uses `npm install` ni `yarn add`.

---

## CLASE 1 — Fundamentos de React y React Native con Expo

### 1.1 Fundamentos de React

#### ¿Qué es React?
- Librería de UI creada por Meta. Solo maneja la capa de vista.
- La UI se construye como un árbol de componentes reutilizables e independientes.
- Modelo **declarativo**: describís cómo debe verse el estado, React actualiza el DOM.
- Usa **Virtual DOM**: compara cambios en memoria antes de tocar el DOM real → renders eficientes.

#### Componentes & JSX

Un componente es una función JS que retorna JSX:

```jsx
function ClaseCard({ titulo }) {
  return <h2>{titulo}</h2>;
}

// Uso
<ClaseCard titulo="Funcional 18:00" />
```

**Reglas JSX:**
- Un solo elemento raíz (wrapeá en `<div>` o en fragmento `<>...</>`).
- Tags siempre cerrados: `<img />` en lugar de `<img>`.
- `className` en lugar de `class`; atributos en **camelCase**.
- Llaves `{ }` para expresiones JavaScript dentro del JSX.

#### Props, Renderizado Condicional y Listas

```jsx
// Props (solo lectura, el hijo nunca las modifica)
function Clase({ titulo, cupos }) {
  return <p>{titulo} — {cupos} cupos</p>;
}
<Clase titulo="Yoga" cupos={10} />

// Renderizado condicional con &&
{cupos > 0 && <Boton>Reservar</Boton>}

// Renderizado condicional con ternario
{cargando ? <Spinner /> : <Lista />}

// Listas con .map() — key obligatoria
{clases.map(c => (
  <ClaseCard key={c.id} titulo={c.nombre} />
))}
// ❌ Sin key → warning + bugs
```

#### Pureza y Árbol de UI

Un componente es **puro** si:
- No modifica variables fuera de sí mismo.
- Misma entrada → misma salida siempre.

```jsx
// ❌ Impuro: modifica variable externa
let contador = 0;
function Cup() {
  contador++;
  return <p>Taza #{contador}</p>;
}

// ✅ Puro: recibe lo que necesita
function Cup({ numero }) {
  return <p>Taza #{numero}</p>;
}
```

El estado fluye **hacia abajo** (props), los eventos **hacia arriba** (callbacks).

---

### 1.2 Hooks

Un Hook es una función especial que empieza con `use`. Permite acceder a funcionalidades internas de React desde un componente.

**Reglas:**
1. Solo dentro de componentes o en otros hooks (no en funciones normales, loops o condicionales).
2. Siempre al nivel superior del componente (no dentro de `if` o `for`).
3. Siempre empiezan con `use`.

#### Hooks autorizados

| Hook | Propósito |
|------|-----------|
| `useState` | Estado local |
| `useEffect` | Efectos / ciclo de vida |
| `useRef` | Referencias sin re-render |
| `useContext` | Estado global |
| `useMemo` | Optimización de cálculos costosos |
| `useCallback` | Memorizar funciones |

#### `useState`

```jsx
const [cupos, setCupos] = useState(20);

// Al reservar:
setCupos(cupos - 1);
// → React detecta el cambio y vuelve a renderizar
```

- **Inmutabilidad**: nunca mutés el estado directamente. Siempre usá el setter.
- **Re-render en cascada**: cuando el estado de un padre cambia, todos sus hijos se re-renderizan (salvo optimizaciones).
- `useState` es **local** al componente. Para compartir estado → Context o librerías.

#### `useEffect`

Sincronizar un componente con algo externo (API, timer, evento...).

```jsx
// 1. Sin dependencias → corre al montar (una sola vez)
useEffect(() => {
  fetchClases();
}, []);

// 2. Con dependencia → corre cuando cambia 'sede'
useEffect(() => {
  filtrarPorSede(sede);
}, [sede]);

// 3. Con cleanup → se llama al desmontar (evita memory leaks)
useEffect(() => {
  const intervalo = setInterval(tick, 1000);
  return () => clearInterval(intervalo);
}, []);
```

> ⚠️ No uses `useEffect` para cosas que no son sincronización con algo externo.

#### `useRef`

```jsx
const inputRef = useRef(null);
inputRef.current.focus();
```

Referencia a un elemento sin disparar re-render. Útil para inputs, timers y valores a persistir entre renders.

#### `useMemo`

```jsx
const total = useMemo(
  () => calcularTotal(items),
  [items]
);
```

Memoriza el resultado de un cálculo costoso. Solo se recalcula si cambia alguna dependencia.

#### `useCallback`

```jsx
const handlePress = useCallback(
  () => reservar(id),
  [id]
);
```

Memoriza una función para que no se recree en cada render. Evita re-renders innecesarios en hijos.

---

### 1.3 React Native

#### Componentes primitivos de React Native

```
<View>  →  android.view / UIView
<Text>  →  TextView / UILabel
<Image> →  ImageView / UIImageView
```

```jsx
function Pantalla() {
  return (
    <View>
      <Text>Hola mundo</Text>
    </View>
  );
}
```

- React Native **no corre en un navegador**. Corre directamente sobre el SO.
- Los componentes JSX se traducen a vistas nativas reales. **No es una WebView**.

---

### 1.4 Expo

#### Expo Go vs Development Build

| | Expo Go | Development Build |
|--|---------|-------------------|
| Compilar | No necesario | Sí (una vez) |
| Librerías | Solo las incluidas en Expo Go | Cualquier librería nativa |
| Cambiar ícono/splash | ❌ | ✅ |
| Hot reload | ✅ | ✅ |

#### Estructura de proyecto generada por Expo

```
my-app/
├── app/               ← Expo Router (pantallas)
│   ├── (tabs)/
│   │   ├── index.tsx  ← tab Home
│   │   └── explore.tsx
│   └── _layout.tsx    ← layout raíz
├── components/        ← componentes reutilizables
├── assets/            ← imágenes, fuentes
├── constants/         ← colores, config
└── package.json
```

---

## CLASE 2 — Gestión de Sesión: useContext, Storage y Biometría

### 2.1 useContext — Estado Global

#### El problema: Prop Drilling

```
App (tiene el user)
  ↓ pasa user como prop
  Navigator
    ↓ pasa user como prop
    HomeScreen
      ↓ pasa user como prop
      Header  ← lo necesita acá
```

Cada nivel intermedio recibe y pasa props que no usa → código frágil.

#### La solución: Context API

```
AuthContext.Provider
  ├─ Navigator
  │   ├─ HomeScreen
  │   │   └─ Header      ← accede directo
  │   └─ ProfileScreen   ← accede directo
  └─ SettingsScreen      ← accede directo
```

#### Comparación de herramientas de estado global

| Herramienta | Curva | Boilerplate | Ideal para |
|-------------|-------|-------------|------------|
| `useContext` | Baja | Mínimo | Auth, tema, idioma |
| Zustand | Baja-Media | Bajo | Apps medianas |
| Redux Toolkit | Media-Alta | Moderado | Apps grandes |
| Jotai / Recoil | Media | Bajo | Estado atómico |

> ✅ En esta materia usamos **`useContext`** — es nativo, sin dependencias y suficiente para manejar la sesión.

#### Creando el AuthContext

```jsx
// context/AuthContext.js
import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

```jsx
// App.js — envolver la app
import { AuthProvider } from './context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        {/* ... stacks / tabs ... */}
      </NavigationContainer>
    </AuthProvider>
  );
}
```

#### Consumiendo el contexto

```jsx
// screens/HomeScreen.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function HomeScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View>
      <Text>Bienvenido, {user?.nombre}</Text>
      <Button title="Cerrar sesión" onPress={logout} />
    </View>
  );
}
```

- **Acceso directo**: no importa qué tan profundo esté el componente.
- **Reactivo**: cuando cambia el contexto, todos los consumidores se re-renderizan.
- **Control de rutas**: `user === null` → redirigir a Login; `user` existe → mostrar Home.

#### Custom Hook — useAuth()

```jsx
// hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
}

// Uso limpio en cualquier componente:
import { useAuth } from '../hooks/useAuth';
const { user, logout } = useAuth();

// También podés derivar lógica:
// const { isAuthenticated } = useAuth();
// donde isAuthenticated = !!user
```

**Ventajas:** encapsula acceso al contexto, valida uso dentro del Provider, permite derivar lógica, un solo import por componente.

---

### 2.2 Storage

El contexto vive solo en **memoria RAM** — al cerrar la app, el estado se pierde.

#### Librerías de storage autorizadas

| | AsyncStorage | SecureStore |
|--|-------------|-------------|
| Librería | `@react-native-async-storage/async-storage` | `expo-secure-store` |
| Encriptado | ❌ No | ✅ Sí (Keychain / Keystore) |
| Tamaño máximo | Sin límite definido | 2 KB por valor |
| Ideal para | Preferencias, caché | Tokens JWT, credenciales |
| Síncrono | ❌ Async | ❌ Async |

> 🔐 **Regla de oro**: si es sensible (tokens, contraseñas, datos de sesión) → siempre **SecureStore**.

#### AsyncStorage — API autorizada

```jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar
await AsyncStorage.setItem('theme', 'dark');
await AsyncStorage.setItem('user', JSON.stringify({ id: 1, nombre: 'Ana' }));

// Leer
const theme = await AsyncStorage.getItem('theme');
const raw = await AsyncStorage.getItem('user');
const user = raw ? JSON.parse(raw) : null;

// Eliminar
await AsyncStorage.removeItem('theme');

// Limpiar todo
await AsyncStorage.clear();
```

> ⚠️ Solo acepta strings. Para objetos: `JSON.stringify()` al guardar y `JSON.parse()` al leer.

#### SecureStore — API autorizada

```jsx
import * as SecureStore from 'expo-secure-store';

// Guardar (encriptado en Keychain / Keystore)
await SecureStore.setItemAsync('token', 'eyJhbGciOiJIUzI1...');
await SecureStore.setItemAsync('user', JSON.stringify(userData));

// Leer
const token = await SecureStore.getItemAsync('token');
const raw = await SecureStore.getItemAsync('user');
const user = raw ? JSON.parse(raw) : null;

// Eliminar
await SecureStore.deleteItemAsync('token');
```

- **Android**: Android Keystore System (cifrado a nivel hardware).
- **iOS**: Keychain Services (cifrado con Face ID / Touch ID).
- Límite: 2 KB por clave. Para datos grandes, guardá el token aquí y el resto en AsyncStorage.

#### Patrón: Storage + Context (persistencia de sesión)

```jsx
// context/AuthContext.js — con persistencia
import { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al montar: leer token guardado
  useEffect(() => {
    const restore = async () => {
      const token = await SecureStore.getItemAsync('token');
      if (token) setUser({ token }); // o decodificá el JWT
      setLoading(false);
    };
    restore();
  }, []);

  const login = async (token, userData) => {
    await SecureStore.setItemAsync('token', token);
    setUser(userData);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  // ... retornar Provider con value={{ user, loading, login, logout }}
}
```

---

### 2.3 WatermelonDB (Storage relacional — opción avanzada)

> ⚠️ **CLAUDE CODE**: Esta librería puede no estar en el proyecto. Antes de usarla, preguntale al usuario si la quiere incorporar.

Librerías involucradas: `@nozbe/watermelondb`, `@nozbe/with-observables`, `expo-sqlite`

Para cuando AsyncStorage/SecureStore no alcanzan y se necesitan datos relacionales, queries y reactividad.

```jsx
// Schema
import { tableSchema, appSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [tableSchema({
    name: 'posts',
    columns: [
      { name: 'title', type: 'string' },
      { name: 'body', type: 'string' },
      { name: 'user_id', type: 'string' },
    ]
  })]
});

// Modelo (JS puro, sin decoradores)
import { Model } from '@nozbe/watermelondb';

export class Post extends Model {
  static table = 'posts';
  // Accedés con: post.title, post.body, post.user_id
}

// Leer
const posts = await database.get('posts').query().fetch();

// Escribir (siempre dentro de database.write)
await database.write(async () => {
  await database.get('posts').create(post => {
    post.title = 'Hola mundo';
    post.body = 'Contenido';
    post.user_id = '123';
  });
});
```

> WatermelonDB es **lazy** — solo carga en memoria los registros que necesitás.

---

### 2.4 Biometría — `expo-local-authentication`

Tipos soportados: `FINGERPRINT`, `FACIAL_RECOGNITION`, `IRIS`.

#### API autorizada

```jsx
import * as LocalAuthentication from 'expo-local-authentication';

// Verificar disponibilidad (siempre antes del prompt)
const hasHardware = await LocalAuthentication.hasHardwareAsync();
const isEnrolled = await LocalAuthentication.isEnrolledAsync();
const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
// types: [1] Fingerprint, [2] FaceID, [3] Iris

// Lanzar el prompt
const result = await LocalAuthentication.authenticateAsync({
  promptMessage: 'Autenticá tu identidad',
  fallbackLabel: 'Usar contraseña',
  cancelLabel: 'Cancelar',
  disableDeviceFallback: false,
});

if (result.success) {
  // autenticación exitosa
} else {
  // result.error: 'user_cancel' | 'lockout' | 'not_enrolled' | 'system_cancel'
}
```

> ⚠️ Siempre verificar `hasHardware` e `isEnrolled` antes de llamar a `authenticateAsync()` para evitar crashes en runtime.

---

### 2.5 Errores comunes — Qué NO hacer

| ❌ Error | ✅ Corrección |
|---------|--------------|
| Guardar JWT en AsyncStorage | Siempre SecureStore para datos sensibles |
| Un solo contexto global para todo (user + theme + cart) | Separar en contextos específicos |
| Restaurar token sin verificar expiración | Decodificar el JWT y validar `exp` antes de setear el user |
| Llamar `authenticateAsync()` sin verificar disponibilidad | Siempre verificar los tres checks antes del prompt |

### 2.6 Best Practice — Separación de contextos

```jsx
// ✅ Correcto: contextos separados
<AuthProvider>       // user, login, logout
  <ThemeProvider>    // darkMode, colors
    <CartProvider>   // items, addItem...
      <App />
    </CartProvider>
  </ThemeProvider>
</AuthProvider>

// Cada componente suscribe solo al contexto que necesita
// → re-render quirúrgico
```

---

## CLASE 3 — React Native vs React DOM, Axios y React Navigation

### 3.1 Scaffold — Estructura de carpetas recomendada

```
my-app/
├── components/    # UI pura, sin lógica (botones, inputs, tarjetas)
├── screens/       # Cada pantalla de navegación (Home, Login…)
├── navigation/    # Stacks, tabs y routers
├── services/      # Comunicación con APIs REST / GraphQL
├── hooks/         # Hooks reutilizables (useAuth, useForm…)
├── context/       # React Contexts (login, dark mode…)
├── store/         # Redux / Zustand — store global
├── utils/         # Helpers: validaciones, formateo de fechas
└── config/        # Constantes, temas, colores globales
```

---

### 3.2 React Native vs React DOM — Diferencias clave

#### Componentes de UI

| React DOM (Web) | React Native |
|----------------|--------------|
| `<div>` | `<View>` |
| `<p>` | `<Text>` |
| `<img>` | `<Image>` |
| `<input>` | `<TextInput>` |
| `<button>` | `<TouchableOpacity>` |

#### Eventos

| React DOM (Web) | React Native |
|----------------|--------------|
| `onClick` | `onPress` (cualquier tap) |
| `onChange` | `onChangeText` (devuelve string directo) |
| `onSubmit` | Se maneja en el botón con `onPress` |
| `onMouseOver` | ❌ No existe |
| `onFocus` / `onKeyDown` | `onFocus` / `onBlur` en `TextInput` |

#### Estilos

| React DOM (Web) | React Native |
|----------------|--------------|
| CSS externo, `className` | Sin CSS externo, sin `className` |
| Bootstrap / Tailwind | Objetos JS: `style={{ ... }}` |
| Selectores, `:hover` | `StyleSheet.create({ ... })` |
| Grid, Float, Flexbox | Solo Flexbox (`direction: column` por defecto) |
| Media queries nativas | `Dimensions` / libs para responsive |

**Conversión CSS → camelCase:**
```
background-color → backgroundColor
font-size        → fontSize
border-radius    → borderRadius
padding-top      → paddingTop
z-index          → zIndex
```

#### Acceso al Sistema Operativo

| React DOM (Web) | React Native |
|----------------|--------------|
| `localStorage` / `sessionStorage` | `AsyncStorage` / `SecureStore` |
| `window.innerHeight` | `Dimensions.get('window').width` |
| `navigator.geolocation` | `expo-location` |
| `addEventListener('scroll')` | `expo-camera` |
| `document.querySelector` | `expo-notifications` / FCM |

---

### 3.3 Comunicación con APIs REST

#### fetch API (nativa, sin librería adicional)

```jsx
// GET
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) throw new Error('Error en la petición');
    return response.json();
  })
  .then(data => console.log('Datos:', data))
  .catch(error => console.error('Error:', error));

// POST
fetch('https://api.example.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'John', age: 30 })
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

#### Axios — Librería autorizada (`axios`)

Ventajas sobre fetch: async/await nativo, manejo automático de JSON, interceptors, interfaz más simple.

```jsx
import axios from 'axios';

// Instancia con baseURL (recomendado, en services/api.js)
export const api = axios.create({ baseURL: 'https://mi-api.com' });

// GET
api.get('/data')
  .then(response => {
    // response.data ya es JSON
    console.log(response.data);
  })
  .catch(error => console.error('Error:', error));
```

#### Axios — Interceptors

```jsx
// REQUEST: adjunta token en cada llamada
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE: detecta 401 y limpia la sesión
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      logoutFn();
    }
    return Promise.reject(error);
  }
);
```

> ⚠️ Los interceptors viven **fuera del árbol de React** — no podés usar `useContext` ahí.

#### Patrón: setupInterceptors con inyección de logout

```jsx
// services/api.js
export function setupInterceptors(logoutFn) {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        await SecureStore.deleteItemAsync('token');
        logoutFn();
      }
      return Promise.reject(error);
    }
  );
}

// context/AuthContext.js — registrar al montar el Provider
useEffect(() => { setupInterceptors(logout); }, []);
```

---

### 3.4 React Navigation (`@react-navigation/native` + navegadores específicos)

React Native **no incluye navegación por defecto**.

#### Tipos de navegación autorizados

| Tipo | Librería | Descripción |
|------|----------|-------------|
| Stack Navigator | `@react-navigation/native-stack` | Pilas de pantallas, navegar adelante/atrás |
| Tab Navigator | `@react-navigation/bottom-tabs` | Navegación con pestañas (como Instagram) |
| Drawer Navigator | `@react-navigation/drawer` | Menú deslizable lateral (como Gmail) |

#### Componentes obligatorios (siempre en este orden)

| Componente | Dónde va | Qué hace |
|------------|----------|----------|
| `NavigationContainer` | `App.js` (raíz) | Contexto global que gestiona el estado de navegación |
| `<X>.Navigator` | `navigation/AppNavigator.jsx` | Define el tipo de navegación |
| `<X>.Screen` | Dentro del Navigator | Registra cada pantalla con nombre y componente |

> ⚠️ Sin `NavigationContainer` → error: `Couldn't find a navigation object`. Equivale al `BrowserRouter` de React Router Web.

#### Configuración completa — Stack Navigator

```jsx
// App.js
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
```

```jsx
// navigation/AppNavigator.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'PokeExplorer' }} />
      <Stack.Screen name="PokemonList" component={PokemonListScreen} options={{ title: 'Pokedex' }} />
      <Stack.Screen
        name="PokemonDetail"
        component={PokemonDetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
```

#### El prop `navigation` (inyectado automáticamente en pantallas)

```jsx
function HomeScreen({ navigation }) {
  return <Button title="Ir a detalles" onPress={() => navigation.navigate('Details')} />;
}
```

| Método | Acción |
|--------|--------|
| `navigation.navigate('Pantalla')` | Ir a una pantalla |
| `navigation.goBack()` | Volver atrás |
| `navigation.replace('Otra')` | Reemplazar la pantalla actual |
| `navigation.navigate('P', { id: 5 })` | Navegar pasando parámetros |

#### Paso de parámetros entre pantallas

```jsx
// Quien ENVÍA
navigation.navigate('PokemonDetail', { name: item.name });

// Quien RECIBE
export default function PokemonDetailScreen({ route, navigation }) {
  const { name } = route.params;

  return (
    <View>
      <Text>Detalle de: {name}</Text>
      <Button title="Volver" onPress={() => navigation.goBack()} />
    </View>
  );
}
```

#### Hooks de navegación (para componentes que no son pantalla)

```jsx
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

// Navegar desde un componente hijo
function MiBoton() {
  const navigation = useNavigation();
  return <Button title="Volver a Home" onPress={() => navigation.navigate('Home')} />;
}

// Leer parámetros desde cualquier componente
function DetallesScreen() {
  const route = useRoute();
  const { nombre, edad } = route.params;
}
```

#### Resumen de Hooks & Props de React Navigation

| Hook / Prop | Para qué sirve | Dónde se usa |
|-------------|----------------|--------------|
| `navigation` prop | Navegar entre pantallas | En pantallas (`Stack.Screen`) |
| `route` prop | Leer parámetros pasados | En pantallas |
| `useNavigation()` | Navegar desde componentes hijos | En cualquier componente |
| `useRoute()` | Leer parámetros desde cualquier comp | En cualquier componente |
| `useFocusEffect()` | Ejecutar efecto al enfocar pantalla | En pantallas (avanzado) |
| `useIsFocused()` | Saber si la pantalla está visible | En pantallas o hooks |

---

## Resumen de librerías autorizadas

> ⚠️ **INSTRUCCIONES PARA CLAUDE CODE**:
> - Si necesitás una librería **que no figura en esta lista** → no la instales. Preguntale al usuario primero.
> - Si una librería **de esta lista no está en el proyecto** → no la instales automáticamente. Preguntale al usuario si la quiere agregar.
> - El gestor de paquetes del proyecto es **`pnpm`**. Nunca uses `npm install` ni `yarn add`.

| Librería | Propósito |
|----------|-----------|
| `react` | Hooks, componentes, JSX |
| `react-native` | Componentes nativos (`View`, `Text`, `Image`, `TextInput`, `TouchableOpacity`, `StyleSheet`, `Dimensions`, etc.) |
| `expo` | Framework base, Expo SDK |
| `@react-navigation/native` | Contenedor de navegación |
| `@react-navigation/native-stack` | Stack Navigator |
| `@react-navigation/bottom-tabs` | Tab Navigator |
| `@react-navigation/drawer` | Drawer Navigator |
| `@react-native-async-storage/async-storage` | Almacenamiento clave-valor sin encriptar |
| `expo-secure-store` | Almacenamiento encriptado (tokens, credenciales) |
| `axios` | Cliente HTTP con interceptors |
| `expo-local-authentication` | Biometría (huella, Face ID, iris) |
| `@nozbe/watermelondb` | Base de datos relacional local (avanzado — consultar al usuario antes de usar) |

---

## Patrones de arquitectura vistos en clase

| Patrón | Descripción |
|--------|-------------|
| AuthContext + Provider | Estado global de sesión sin prop drilling |
| Custom hook `useAuth()` | Encapsula y valida el acceso al AuthContext |
| Separación de contextos | Un contexto por dominio (`AuthContext`, `ThemeContext`, etc.) |
| Storage + Context | Persistencia de sesión entre cierres de app con SecureStore |
| `setupInterceptors(logoutFn)` | Inyectar logout en Axios fuera del árbol de React |
| Scaffold por responsabilidad | `components/`, `screens/`, `navigation/`, `services/`, `hooks/`, `context/` |
| Hook `useFetch` reutilizable | Mismo hook funciona en React Web y React Native |