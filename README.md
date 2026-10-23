# 🤖 Unitree Robot Control

Aplicación móvil para **controlar robots Unitree (Go2 cuadrúpedo y G1 humanoide)** desde el celular: conectarse, moverlos con un joystick táctil, ejecutar acciones y revisar el historial de comandos.

Trabajo práctico obligatorio de **Desarrollo de Aplicaciones 1 — UADE (1.er cuatrimestre 2026)**, desarrollado en equipo con **React Native + Expo**.

<p align="center">
  <img src="assets/images/GO2.png" alt="Unitree Go2" height="180" />
  &nbsp;&nbsp;&nbsp;
  <img src="assets/images/G1.png" alt="Unitree G1" height="180" />
</p>

---

## ✨ Funcionalidades

| | Funcionalidad | Descripción |
|---|---|---|
| 🔐 | **Login y registro** | Autenticación con JWT guardado de forma segura (`expo-secure-store`). Soporta desbloqueo biométrico. |
| 🔌 | **Selección y conexión** | Elegí entre Go2 y G1, conectate/desconectate y consultá el estado de la conexión en tiempo real. |
| 🕹️ | **Control de movimiento** | Botones direccionales (mantener presionado) y joystick virtual con movimiento proporcional. Frena automáticamente al soltar o salir de la pantalla. |
| 🎭 | **Acciones y modos especiales** | Pararse, sentarse y acciones/modos disponibles según el robot conectado. |
| 🟢 | **Estado global** | Indicador de conexión visible en el header de toda la app. |
| 📜 | **Historial de comandos** | Registro de las acciones de la sesión actual y de sesiones pasadas, por usuario. |

## 🧰 Stack

- [Expo SDK 54](https://docs.expo.dev/) · React 19 · React Native 0.81
- [React Navigation 7](https://reactnavigation.org/) (native stack)
- [Axios](https://axios-http.com/) para el cliente HTTP
- `expo-secure-store`, `expo-local-authentication`, `@react-native-async-storage/async-storage`
- Gestor de paquetes: **pnpm**

## 🚀 Cómo correrlo

### Requisitos

- Node.js 18+ y [pnpm](https://pnpm.io/)
- La app **Expo Go** en tu celular (o un emulador Android/iOS)
- Acceso a una API backend compatible (ver más abajo) en la misma red que tu dispositivo

### Pasos

```bash
# 1. Clonar e instalar dependencias
git clone https://github.com/FrancoF04/UADE_TPO_DdA1_React_G11.git
cd UADE_TPO_DdA1_React_G11
pnpm install

# 2. Configurar el backend
cp .env.example .env
# editá .env con el host y puerto de tu servidor

# 3. Iniciar
pnpm start
```

Escaneá el QR con Expo Go, o usá `pnpm android` / `pnpm ios` / `pnpm web`.

### Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `EXPO_PUBLIC_API_HOST` | Host o IP del backend, **sin** `http://` | `192.168.0.10` |
| `EXPO_PUBLIC_API_PORT` | Puerto del backend | `8000` |

El archivo `.env` está ignorado por git; `.env.example` sirve de plantilla.

## 🔗 Backend

La app **no se comunica directamente con los robots**: consume una API REST en Python provista por la cátedra, que corre en la red del laboratorio y traduce las órdenes al robot. El backend no forma parte de este repositorio ni fue desarrollado por el equipo, por lo que para usar la app con un robot real hace falta acceso a esa infraestructura.

## 🗂️ Estructura del proyecto

```
App.jsx            Entry point, providers y navegación
components/        Componentes de UI reutilizables (cada uno con su .styles.js)
screens/           Pantallas: Login, Registro, Selección de robot, Estado, Movimiento, Acciones
navigation/        Stack navigator (rutas públicas vs. autenticadas)
context/           Contextos por dominio: Auth, Robot, Historial
hooks/             Hooks personalizados
services/          Capa de acceso a la API (Axios)
utils/             Biometría, manejo de token y almacenamiento de sesión
config/            Colores, tema y constantes
```

## 🎮 Cómo se usa

1. **Registrate o iniciá sesión.**
2. **Elegí el robot** (Go2 o G1) y conectate.
3. Desde la pantalla de estado accedé a **Movimiento** o **Acciones**.
4. En Movimiento, mantené presionada una flecha o usá el joystick; al soltar, el robot se detiene.

## 📄 Licencia

Distribuido bajo licencia CC0 1.0. Ver [LICENSE](LICENSE).
