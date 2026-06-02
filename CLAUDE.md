@AGENTS.md

---

# Estado actual del proyecto

## Descripción general

Aplicación móvil en React Native (Expo 54) para controlar robots Unitree (Go2 cuadrúpedo / G1 humanoide) a través de una API REST en Python que corre en la red del laboratorio. El TPO se divide en 7 funcionalidades. El trabajo es grupal — cada integrante implementa su funcionalidad en una rama separada.

## Rama actual

`feature/second-feature-connection` — Funcionalidad 2 (Control de Movimiento).

---

## Funcionalidades y estado

| # | Funcionalidad | Estado | Rama |
|---|---------------|--------|------|
| 1 | Pantalla de Conexión (connect/disconnect, status) | ⏳ Pendiente (otro dev) | — |
| 2 | Pantalla de Control de Movimiento | ✅ Implementada | `feature/second-feature-connection` |
| 3 | Pantalla de Acciones | 🧪 Mock en `/test/` | `feature/second-feature-connection` |
| 4 | Estado global de conexión (header) | ⏳ Pendiente | — |
| 5 | Login | 🧪 Mock en `/test/` | `feature/second-feature-connection` |
| 6 | Registro | 🧪 Mock en `/test/` | `feature/second-feature-connection` |
| 7 | Historial de comandos (server-side) | ⏳ Pendiente | — |

Los mocks de Features 3, 5 y 6 son **funcionales** (conectan al backend real) pero mínimos en UI.
Se implementaron para desbloquear el flujo completo mientras los devs responsables construyen las versiones definitivas.
Para integrar cada feature cuando esté lista: seguir `test/CLEANUP.md`.

---

## Mapa de archivos implementados

```
App.js                          ← Entry point. Envuelve con AuthProvider [TEST] > RobotProvider [TEST] > NavigationContainer
index.js                        ← Registra App con Expo (no tocar)
jsconfig.json                   ← Habilita alias @/ para imports absolutos

config/
  colors.js                     ← Paleta de colores del tema oscuro (COLORS)
  constants.js                  ← API_BASE_URL construida desde variables de entorno

services/
  api.js                        ← Instancia de Axios con baseURL y timeout (8s)
  robotService.js               ← getStatus, move, stop, standup, sitdown
  authService.js                ← login (POST /auth/token), register (POST /auth/register)
  actionsService.js             ← getActions (GET /actions), executeAction (POST /action/{name})

context/
  RobotContext.js               ← [TEST/TEMPORAL] Provee isConnected, robotType, connect, disconnect, refreshStatus
                                   Será reemplazado por la implementación real de Funcionalidad 1
  AuthContext.js                ← [TEST/TEMPORAL] Provee isAuthenticated, isLoading, login, logout
                                   SecureStore para persistir JWT. Interceptors Axios (Bearer + 401→logout).
                                   Será reemplazado por la implementación real de Features 5 y 6

components/
  DirButton/                    ← Botón direccional con soporte hold (onPressIn/onPressOut)
  ActionButton/                 ← Botón de acción genérico (Pararse / Sentarse)
  FeedbackToast/                ← Mensaje de resultado de cada operación (éxito/error, 3s)
  ConnectionBanner/             ← Banner amarillo "robot no conectado"
  VirtualJoystick/              ← Joystick táctil con PanResponder (Y→vx, X→vyaw)

screens/
  MovementScreen.js             ← Pantalla principal Feature 2
  MovementScreen.styles.js

navigation/
  AppNavigator.js               ← Stack Navigator con routing condicional:
                                   !isAuthenticated → Login / Register (mocks)
                                   isAuthenticated  → Connection (mock) / Movement / Actions (mock)

test/                           ← TODO DESCARTABLE — borrar al integrar Features 1, 3, 5 y 6
  CLEANUP.md                    ← Guía paso a paso de integración para Features 1, 3, 5 y 6
  screens/
    ConnectionScreen.js         ← UI mock mínima de Feature 1 (incluye botones a Movement y Actions)
    ConnectionScreen.styles.js
    LoginScreen.js              ← UI mock mínima de Feature 5
    LoginScreen.styles.js
    RegisterScreen.js           ← UI mock mínima de Feature 6
    RegisterScreen.styles.js
    ActionsScreen.js            ← UI mock mínima de Feature 3 (grilla + historial local)
    ActionsScreen.styles.js
```

---

## Setup de testing (estado actual)

La app arranca en `LoginScreen` (mock de Feature 5). El flujo completo es:

1. **Login** — ingresar email/usuario y contraseña → llama a `POST /auth/token`
   - Sin cuenta: tocar "Registrate" → ir a RegisterScreen
2. **Register** — ingresar username, email, contraseña y confirmación → llama a `POST /auth/register` → vuelve a Login
3. Una vez autenticado, la app navega automáticamente a `ConnectionScreen` (mock de Feature 1)
4. **Connection** — seleccionar robot (Go2 / G1), confirmar interfaz de red (`eth0`), presionar "Conectar" → `POST /connect`
5. Si conecta OK → se habilitan los botones de navegación:
   - "Ir a Control de Movimiento" → `MovementScreen` (Feature 2)
   - "Ir a Acciones" → `ActionsScreen` (mock de Feature 3)
6. **ActionsScreen** — carga `GET /actions` al conectar, muestra grilla de botones. Cada botón llama a `POST /action/{nombre}`. Historial local con timestamps por sesión.

El JWT se persiste en `SecureStore`: si el usuario cierra y reabre la app, salta directo a Connection.
El botón "Cerrar sesión" está al fondo de `ConnectionScreen`.

Si el robot no está conectado, `MovementScreen` y `ActionsScreen` siguen siendo accesibles pero los controles quedan deshabilitados (opacity 0.35).

**Para integrar cada feature cuando esté lista:** seguir `test/CLEANUP.md`.

---

## Variables de entorno

Archivo `.env` (git-ignorado) en la raíz del proyecto:

```
EXPO_PUBLIC_API_HOST=http://<IP_DEL_SERVIDOR>
EXPO_PUBLIC_API_PORT=<PUERTO>
```

Ver `.env.example` para referencia. `config/constants.js` las combina en `API_BASE_URL`.

---

## Contrato de AuthContext

`AppNavigator` depende de `useAuth()`. La implementación real de Features 5 y 6 **debe** respetar este contrato mínimo:

```js
import { useAuth } from '@/context/AuthContext';

const { isAuthenticated, isLoading, login, logout } = useAuth();
// isAuthenticated: boolean
// isLoading: boolean  — true mientras se restaura la sesión desde SecureStore al arrancar
// login(identifier, password): async, lanza excepción en error
// logout(): async
```

`AppNavigator` usa `isAuthenticated` e `isLoading` para el routing condicional.
La implementación real **debe mantener los interceptors de Axios**:
- Request: agrega `Authorization: Bearer <token>` en cada llamada.
- Response: llama `logout()` ante un `401`.
Sin esto, todos los endpoints protegidos fallan.

---

## Contrato de RobotContext

`MovementScreen` y `ActionsScreen` dependen de `useRobot()`. La implementación de Feature 1 **debe** respetar este contrato mínimo:

```js
import { useRobot } from '@/context/RobotContext';

const { isConnected, robotType } = useRobot();
// isConnected: boolean
// robotType: 'go2' | 'g1' | null
```

Si Feature 1 agrega más valores al contexto, no hay problema — solo no puede quitar esos dos.

---

## Contrato de pantallas con el navegador

Las pantallas están registradas con estos nombres en el Stack Navigator — no cambiarlos:

```js
<Stack.Screen name="Movement" component={MovementScreen} />
<Stack.Screen name="Actions"  component={ActionsScreen}  />
```

Feature 1 puede navegar hacia ellas con `navigation.navigate('Movement')` / `navigation.navigate('Actions')`.

---

## Lógica de movimiento (Feature 2)

| Control | Endpoint | Valores |
|---------|----------|---------|
| Botón ↑ (hold) | `POST /move` | `vx=0.5, vy=0, vyaw=0` |
| Botón ↓ (hold) | `POST /move` | `vx=-0.5, vy=0, vyaw=0` |
| Botón ← (hold) | `POST /move` | `vx=0, vy=0, vyaw=1.0` |
| Botón → (hold) | `POST /move` | `vx=0, vy=0, vyaw=-1.0` |
| Soltar cualquier botón | `POST /stop` | — |
| STOP | `POST /stop` | — |
| Pararse | `POST /standup` | — |
| Sentarse | `POST /sitdown` | — |
| Joystick Y | `POST /move` | `vx` proporcional (-1 a 1) |
| Joystick X | `POST /move` | `vyaw` proporcional (-1 a 1) |
| Soltar joystick | `POST /stop` | — |

Los botones direccionales envían comandos repetidos cada **150ms** mientras se mantienen presionados (usando `setInterval` + `onPressIn`/`onPressOut`).

---

## Stack tecnológico

- **Expo SDK 54** — framework base
- **React 19** + **React Native 0.81**
- **React Navigation 7** (`native-stack`) — navegación
- **Axios 1.x** — cliente HTTP
- **PanResponder** (core RN) — joystick táctil
- **pnpm** — gestor de paquetes (nunca usar npm/yarn)

Librerías instaladas no usadas aún (disponibles para Features futuras):
- `@react-native-async-storage/async-storage` — preferencias
- `expo-local-authentication` — biometría (Feature 5 podría usarla)
- `@react-navigation/bottom-tabs` — no instalado aún, podría hacer falta para Features 4-7

Ya en uso:
- `expo-secure-store` — persiste el JWT en `AuthContext` bajo la clave `'auth_token'`

---

## Decisiones de diseño tomadas

- **Tema oscuro** — paleta en `config/colors.js` (bg `#0d1117`, card `#161b22`, accent `#2188ff`)
- **Un contexto por dominio** — `RobotContext` para robot, `AuthContext` para sesión (ambos temporales)
- **Servicios separados por dominio** — `robotService` (Feature 2), `authService` (Features 5/6), `actionsService` (Feature 3). connect/disconnect pertenecen a Feature 1 (están en `RobotContext` temporalmente)
- **StyleSheet en archivo propio** — cada componente/pantalla tiene su `.styles.js`
- **Imports con `@/`** — nunca rutas relativas (`../../`)
- **Commits convencionales en español** — `feat:`, `fix:`, `chore:`, `docs:`, `test:` + primera letra mayúscula + punto final
