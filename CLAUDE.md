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
| 3 | Pantalla de Acciones | ⏳ Pendiente (mismo dev que F2) | — |
| 4 | Estado global de conexión (header) | ⏳ Pendiente | — |
| 5 | Login | ⏳ Pendiente | — |
| 6 | Registro | ⏳ Pendiente | — |
| 7 | Historial de comandos (server-side) | ⏳ Pendiente | — |

---

## Mapa de archivos implementados

```
App.js                          ← Entry point. Envuelve con RobotProvider > NavigationContainer
index.js                        ← Registra App con Expo (no tocar)
jsconfig.json                   ← Habilita alias @/ para imports absolutos

config/
  colors.js                     ← Paleta de colores del tema oscuro (COLORS)
  constants.js                  ← API_BASE_URL construida desde variables de entorno

services/
  api.js                        ← Instancia de Axios con baseURL y timeout (8s)
  robotService.js               ← getStatus, move, stop, standup, sitdown

context/
  RobotContext.js               ← Provee isConnected, robotType, connectionStatus,
                                   connect, disconnect, refreshStatus
                                   Será reemplazado/extendido por Feature 1

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
  AppNavigator.js               ← Stack Navigator. Pantalla inicial: Movement
```

---

## Variables de entorno

Archivo `.env` (git-ignorado) en la raíz del proyecto:

```
EXPO_PUBLIC_API_HOST=http://<IP_DEL_SERVIDOR>
EXPO_PUBLIC_API_PORT=<PUERTO>
```

Ver `.env.example` para referencia. `config/constants.js` las combina en `API_BASE_URL`.

---

## Contrato de RobotContext

`MovementScreen` depende de `useRobot()`. La implementación de Feature 1 **debe** respetar este contrato mínimo:

```js
import { useRobot } from '@/context/RobotContext';

const { isConnected, robotType, refreshStatus } = useRobot();
// isConnected: boolean
// robotType: 'go2' | 'g1' | null
// refreshStatus(): async — consulta GET /status y actualiza el estado
```

Si Feature 1 agrega más valores al contexto, no hay problema — solo no puede quitar esos tres.

---

## Contrato de pantallas con el navegador

`MovementScreen` está registrada con este nombre en el Stack Navigator — no cambiarlo:

```js
<Stack.Screen name="Movement" component={MovementScreen} />
```

Feature 1 puede navegar hacia ella con `navigation.navigate('Movement')`.

---

## Lógica de movimiento (Feature 2)

| Control | Endpoint | Valores |
|---------|----------|---------|
| Botón ↑ (hold) | `POST /move` | `vx=0.3, vy=0, vyaw=0` |
| Botón ↓ (hold) | `POST /move` | `vx=-0.3, vy=0, vyaw=0` |
| Botón ← (hold) | `POST /move` | `vx=0, vy=0, vyaw=0.3` |
| Botón → (hold) | `POST /move` | `vx=0, vy=0, vyaw=-0.3` |
| Soltar cualquier botón | `POST /stop` | — |
| STOP | `POST /stop` | — |
| Pararse | `POST /standup` | — |
| Sentarse | `POST /sitdown` | — |
| Joystick Y | `POST /move` | `vx` proporcional (-1 a 1) |
| Joystick X | `POST /move` | `vyaw` proporcional (-1 a 1) |
| Soltar joystick | `POST /stop` | — |
| Salir de la pantalla | `POST /stop` | via `useFocusEffect` cleanup |

Los botones direccionales envían comandos repetidos cada **150ms** mientras se mantienen presionados (usando `setInterval` + `onPressIn`/`onPressOut`).
Al navegar fuera de `MovementScreen` (back, otra pantalla) se limpia el intervalo y se manda stop automáticamente — evita que el robot quede moviéndose sin control.

---

## Stack tecnológico

- **Expo SDK 54** — framework base
- **React 19** + **React Native 0.81**
- **React Navigation 7** (`native-stack`) — navegación
- **Axios 1.x** — cliente HTTP
- **PanResponder** (core RN) — joystick táctil
- **pnpm** — gestor de paquetes (nunca usar npm/yarn)

Librerías instaladas no usadas aún (disponibles para Features futuras):
- `expo-secure-store` — tokens JWT (Feature 5 Login)
- `@react-native-async-storage/async-storage` — preferencias
- `expo-local-authentication` — biometría (Feature 5 podría usarla)
- `@react-navigation/bottom-tabs` — no instalado aún, podría hacer falta para Features 4-7

---

## Decisiones de diseño tomadas

- **Tema oscuro** — paleta en `config/colors.js` (bg `#0d1117`, card `#161b22`, accent `#2188ff`)
- **Un contexto por dominio** — `RobotContext` para robot; Feature 1 puede extenderlo o reemplazarlo
- **Servicios separados por dominio** — `robotService` solo tiene endpoints de Feature 2; connect/disconnect están en `RobotContext` temporalmente hasta que Feature 1 los tome
- **StyleSheet en archivo propio** — cada componente/pantalla tiene su `.styles.js`
- **Imports con `@/`** — nunca rutas relativas (`../../`)
- **Commits convencionales en español** — `feat:`, `fix:`, `chore:`, `docs:`, `test:` + primera letra mayúscula + punto final
