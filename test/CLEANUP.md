# Guía de limpieza — Integración de Funcionalidades 1, 5 y 6

Este archivo documenta todos los cambios temporales hechos para testear las Funcionalidades 2 y 3
antes de que las Funcionalidades 1, 5 y 6 estén implementadas. Seguir estos pasos en orden cuando
los desarrolladores entreguen su código.

---

## Funcionalidad 1 — Pantalla de Conexión

### Paso 1 — Borrar esta carpeta completa

```
/test/
```

Todo lo que está acá es mock descartable. No tocar ningún otro archivo al hacer esto.

---

### Paso 2 — Reemplazar `context/RobotContext.js`

**Archivo:** `context/RobotContext.js`

**Qué hay ahora:** Un contexto mínimo que expone `isConnected`, `robotType`,
`connectionStatus`, `connect()`, `disconnect()` y `refreshStatus()`. Lo llaman internamente
desde la `ConnectionScreen` del test y desde `MovementScreen`.

**Qué hacer:** Reemplazar con la implementación real de Feature 1. El contexto real
**debe** seguir exportando como mínimo:

```js
export function RobotProvider({ children }) { ... }
export function useRobot() {
  // debe retornar al menos:
  // { isConnected: boolean, robotType: 'go2' | 'g1' | null }
}
```

`MovementScreen` depende de `useRobot()` y consume exactamente esos dos valores.
Si Feature 1 agrega más cosas al contexto, no hay problema — solo no sacar esos dos.

---

### Paso 3 — Actualizar `navigation/AppNavigator.js`

**Archivo:** `navigation/AppNavigator.js`

**Qué hay ahora:** Navegación condicional basada en `isAuthenticated`. Cuando está autenticado
muestra `Connection` (mock) y `Movement`. Los imports de test son:

```js
import ConnectionScreen from '@/test/screens/ConnectionScreen';
import LoginScreen from '@/test/screens/LoginScreen';
import RegisterScreen from '@/test/screens/RegisterScreen';
```

**Qué hacer:**
1. Borrar el import de `ConnectionScreen` desde `@/test/screens/ConnectionScreen`.
2. Agregar la pantalla real de Feature 1 (Conexión real).
3. Mantener `Login`, `Register` y `Movement` como están.
4. Mantener la lógica condicional `!isAuthenticated` / autenticado — solo cambiar qué componente
   usa `Connection`.

Ejemplo de cómo debería quedar la parte relevante:

```js
// Borrar esto:
import ConnectionScreen from '@/test/screens/ConnectionScreen';

// Agregar la pantalla de Feature 1:
import ConnectionScreen from '@/screens/ConnectionScreen'; // la real
```

---

### Paso 4 — Actualizar `App.js`

**Archivo:** `App.js`

**Qué hay ahora:** `AuthProvider` > `RobotProvider` > `NavigationContainer`.

**Qué hacer:**
1. Reemplazar el import de `RobotProvider` si Feature 1 lo mueve o renombra.
2. La jerarquía `AuthProvider > RobotProvider` debe mantenerse.

---

---

## Funcionalidades 5 y 6 — Login y Registro

### Paso A — Borrar pantallas mock de `/test/`

Al borrar `/test/` completo (Paso 1 arriba), también se eliminan:
- `test/screens/LoginScreen.js` + `LoginScreen.styles.js`
- `test/screens/RegisterScreen.js` + `RegisterScreen.styles.js`

---

### Paso B — Reemplazar `context/AuthContext.js`

**Archivo:** `context/AuthContext.js`

**Qué hay ahora:** Un contexto mínimo que expone `isAuthenticated`, `isLoading`, `login()` y
`logout()`. Persiste el JWT en SecureStore bajo la clave `'auth_token'`. Configura interceptors
de Axios para el Bearer token y el manejo de 401.

**Qué hacer:** Reemplazar con la implementación real de Features 5 y 6. El contexto real
**debe** seguir exportando como mínimo:

```js
export function AuthProvider({ children }) { ... }
export function useAuth() {
  // debe retornar al menos:
  // { isAuthenticated: boolean, isLoading: boolean, login: Function, logout: Function }
}
```

`AppNavigator` depende de `isAuthenticated` e `isLoading` para el routing condicional.

**IMPORTANTE:** El contexto real debe mantener los interceptors de Axios (request + response):
- Request: adjunta `Authorization: Bearer <token>` en cada llamada.
- Response: llama `logout()` ante un `401`.

Si no se mantienen, todos los endpoints protegidos (`/connect`, `/move`, `/stop`, etc.) fallarán
con 401.

---

### Paso C — Actualizar `navigation/AppNavigator.js`

**Archivo:** `navigation/AppNavigator.js`

**Qué hay ahora:** Importa `LoginScreen` y `RegisterScreen` desde `@/test/screens/`.

**Qué hacer:**
1. Reemplazar los imports con las pantallas reales de Features 5 y 6:

```js
// Borrar esto:
import LoginScreen from '@/test/screens/LoginScreen';
import RegisterScreen from '@/test/screens/RegisterScreen';

// Agregar las pantallas reales:
import LoginScreen from '@/screens/LoginScreen';
import RegisterScreen from '@/screens/RegisterScreen';
```

2. La lógica de routing condicional (`!isAuthenticated` → Login/Register, autenticado →
   Connection/Movement) **debe mantenerse exactamente igual**.

---

### Paso D — `services/authService.js` (no tocar)

**Archivo:** `services/authService.js`

Este archivo **no es mock** — llama a los endpoints reales de la API (`/auth/token` y
`/auth/register`). La implementación real de Features 5 y 6 puede usarlo tal cual o
enriquecerlo sin necesidad de reescribirlo.

---

---

## Funcionalidad 3 — Pantalla de Acciones

### Paso E — Borrar pantalla mock de `/test/`

Al borrar `/test/` completo (Paso 1 arriba), también se elimina:
- `test/screens/ActionsScreen.js` + `ActionsScreen.styles.js`

---

### Paso F — Actualizar `navigation/AppNavigator.js`

**Archivo:** `navigation/AppNavigator.js`

**Qué hay ahora:** Importa `ActionsScreen` desde `@/test/screens/ActionsScreen`.

**Qué hacer:** Reemplazar el import con la pantalla real de Feature 3:

```js
// Borrar esto:
import ActionsScreen from '@/test/screens/ActionsScreen';

// Agregar la pantalla real:
import ActionsScreen from '@/screens/ActionsScreen';
```

El `Stack.Screen name="Actions"` ya está registrado — no hay que agregar nada más.

---

### Paso G — `services/actionsService.js` (no tocar)

**Archivo:** `services/actionsService.js`

Este archivo **no es mock** — llama a `GET /actions` y `POST /action/{name}`. La implementación
real de Feature 3 puede usarlo tal cual.

---

## Resumen de archivos tocados

| Archivo | Tipo de cambio | Acción al integrar |
|---------|---------------|--------------------|
| `test/` (toda la carpeta) | Nuevo — descartable | Borrar completo |
| `context/RobotContext.js` | Nuevo — temporal | Reemplazar con el de Feature 1 |
| `context/AuthContext.js` | Nuevo — temporal | Reemplazar con el de Features 5 y 6 |
| `services/authService.js` | Nuevo — permanente | No tocar (o enriquecer) |
| `services/actionsService.js` | Nuevo — permanente | No tocar (o enriquecer) |
| `navigation/AppNavigator.js` | Modificado | Actualizar imports de pantallas |
| `App.js` | Modificado | Revisar providers si Feature 1 los renombra |
