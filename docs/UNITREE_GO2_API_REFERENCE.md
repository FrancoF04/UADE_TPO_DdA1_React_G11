# Unitree Robot — API Reference

Documentación de endpoints del Mock Server / Robot Unitree.
Basada en [`unitree_sdk2_python`](https://github.com/unitreerobotics/unitree_sdk2_python/tree/master)
y `unitree_sdk2/include/unitree/robot/go2/sport/sport_client.hpp`.

---

## Base URL

```
Desarrollo (mock):  http://localhost:8080
Robot real (AP):    http://192.168.8.1:8082
```

---

## Formato de respuesta universal

Todos los endpoints devuelven:

```json
{
  "code": 0,
  "msg": "OK",
  "data": { ... },
  "timestamp": 1717200000.123
}
```

`code: 0` = éxito. Cualquier otro valor = error.

---

## Cliente base con Axios

```js
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 5000,
});

// Uso: client.get("/robot/state")  →  res.data.data
//      client.post("/robot/move", { vx: 0.5, vy: 0, vyaw: 0 })
```

---

## WebSocket — solo para telemetría

El WebSocket **no tiene ninguna relación con los comandos de control**.
Todos los movimientos, gestos, acrobacias y configuración son `POST` HTTP normales.

El WebSocket sirve únicamente para **leer el estado del robot en tiempo real**
(batería, modo, IMU, velocidades, fuerzas en patas). Si no necesitás esos datos
en vivo, podés usar `GET /robot/state` por polling y olvidarte del WebSocket.

Endpoint: `ws://localhost:8080/ws/state` — emite estado cada 100ms.

```js
const ws = new WebSocket("ws://localhost:8080/ws/state");

ws.onmessage = (event) => {
  const state = JSON.parse(event.data);
  // state.mode, state.battery, state.body_height,
  // state.velocity.vx/vy/vyaw,
  // state.body_attitude.roll/pitch/yaw,
  // state.foot_force[0..3],
  // state.gait_type, state.obstacle_avoidance
};
```

Payload:

```json
{
  "type": "state",
  "timestamp": 1717200000.123,
  "mode": "standing",
  "battery": 87.3,
  "body_height": 0.28,
  "velocity": { "vx": 0.0, "vy": 0.0, "vyaw": 0.0 },
  "body_attitude": { "roll": 0.001, "pitch": -0.002, "yaw": 0.0 },
  "foot_force": [28.4, 27.1, 30.3, 29.6],
  "obstacle_avoidance": false,
  "gait_type": 0
}
```

---

## Telemetría (HTTP)

### `GET /robot/state`

Estado completo del robot. Equivale al topic DDS `rt/sportmodestate`.

```js
const res = await client.get("/robot/state");
const state = res.data.data;
```

Respuesta `data`:

```json
{
  "mode": "standing",
  "progress": 0,
  "gait_type": 0,
  "speed_level": 0,
  "foot_raise_height": 0.09,
  "body_height": 0.28,
  "position": { "x": 0.0, "y": 0.0, "z": 0.0 },
  "velocity": { "vx": 0.0, "vy": 0.0, "vyaw": 0.0 },
  "body_attitude": { "roll": 0.0, "pitch": 0.0, "yaw": 0.0 },
  "imu": {
    "quaternion": [1.0, 0.0, 0.0, 0.0],
    "gyroscope": [0.0, 0.0, 0.0],
    "accelerometer": [0.02, -0.01, 9.81],
    "rpy": [0.0, 0.0, 0.0],
    "temperature": 36
  },
  "foot_force": [28.5, 27.3, 30.1, 29.8],
  "foot_force_est": [28.5, 27.3, 30.1, 29.8],
  "obstacle_avoidance": false,
  "error_code": 0,
  "battery": 87.5,
  "led_brightness": 128,
  "volume": 50
}
```

Referencia de campos:

| Campo | Tipo | Unidad | Descripción |
|-------|------|--------|-------------|
| `mode` | string | — | `damping` / `standing` / `walking` / `lying` |
| `battery` | float | % | Nivel de batería (0–100) |
| `body_height` | float | m | Altura del cuerpo (0.18–0.38) |
| `gait_type` | int | — | 0=Normal, 1=Trot, 2=Climb, 3=Stairs |
| `velocity.vx` | float | m/s | Velocidad adelante/atrás |
| `velocity.vy` | float | m/s | Velocidad lateral |
| `velocity.vyaw` | float | rad/s | Velocidad rotacional |
| `body_attitude.roll` | float | rad | Inclinación lateral |
| `body_attitude.pitch` | float | rad | Inclinación adelante/atrás |
| `body_attitude.yaw` | float | rad | Orientación horizontal |
| `foot_force` | float[4] | N | Fuerza por pata: FL, FR, RL, RR |
| `imu.accelerometer` | float[3] | m/s² | [ax, ay, az] |
| `imu.rpy` | float[3] | rad | Roll, pitch, yaw del IMU |
| `error_code` | int | — | 0 = sin errores |

---

### `GET /robot/battery`

```js
const res = await client.get("/robot/battery");
// res.data.data → { "battery": 87.5, "charging": false }
```

---

### `GET /robot/imu`

```js
const res = await client.get("/robot/imu");
// res.data.data → { "acc": [ax, ay, az], "gyro": [gx, gy, gz], "rpy": [roll, pitch, yaw] }
```

---

### `GET /robot/log`

Historial de los últimos 50 comandos recibidos por el robot.

```js
const res = await client.get("/robot/log");
// res.data.data → { "count": 12, "log": [ { "time": "...", "action": "move", "params": {...} } ] }
```

---

## Control básico

### `POST /robot/stand`

Pararse desde damping/lying. SDK: `SportClient.StandUp()` — api_id `1004`.

```js
const res = await client.post("/robot/stand");
// res.data.data → { "mode": "standing" }
```

---

### `POST /robot/damp`

Relajar motores (estado seguro de reposo). SDK: `SportClient.Damp()` — api_id `1001`.

```js
await client.post("/robot/damp");
// res.data.data → { "mode": "damping" }
```

---

### `POST /robot/lie_down`

Acostarse. SDK: `SportClient.StandDown()` — api_id `1005`.

```js
await client.post("/robot/lie_down");
// res.data.data → { "mode": "lying" }
```

---

### `POST /robot/recover_stand`

Recuperar postura erguida (si el robot cayó). SDK: `SportClient.RecoveryStand()` — api_id `1006`.

```js
await client.post("/robot/recover_stand");
// res.data.data → { "mode": "standing" }
```

---

### `POST /robot/stop_move`

Detener todo movimiento. SDK: `SportClient.StopMove()` — api_id `1003`.

```js
await client.post("/robot/stop_move");
```

---

## Movimiento

### `POST /robot/move`

Control de velocidad continuo. SDK: `SportClient.Move(vx, vy, vyaw)` — api_id `1008`.

> Nota: internamente usa `_CallNoReply()` — no espera confirmación del robot para
> minimizar latencia. Es normal que la respuesta no contenga confirmación de ejecución.

**Prerrequisito:** el robot debe estar en `standing` o `walking`. En `damping` devuelve `code: 1002`.

| Parámetro | Tipo | Unidad | Rango | Descripción |
|-----------|------|--------|-------|-------------|
| `vx` | float | m/s | `-1.5` a `1.5` | Adelante (+) / atrás (-) |
| `vy` | float | m/s | `-0.8` a `0.8` | Izquierda (+) / derecha (-) |
| `vyaw` | float | rad/s | `-1.2` a `1.2` | Antihorario (+) / horario (-) |

```js
// Adelante
await client.post("/robot/move", { vx: 0.5, vy: 0, vyaw: 0 });

// Atrás
await client.post("/robot/move", { vx: -0.5, vy: 0, vyaw: 0 });

// Girar en el lugar (horario)
await client.post("/robot/move", { vx: 0, vy: 0, vyaw: -0.8 });

// Lateral izquierda
await client.post("/robot/move", { vx: 0, vy: 0.4, vyaw: 0 });

// Curva: adelante + giro suave
await client.post("/robot/move", { vx: 0.4, vy: 0, vyaw: 0.5 });

// Parar
await client.post("/robot/move", { vx: 0, vy: 0, vyaw: 0 });
```

---

## Postura y orientación

### `POST /robot/pose`

Ajusta roll, pitch, yaw y altura del cuerpo. SDK: `SportClient.Euler()` — api_id `1007`.

**Prerrequisito:** modo `standing`.

| Parámetro | Tipo | Unidad | Rango | Descripción |
|-----------|------|--------|-------|-------------|
| `roll` | float | rad | `-0.5` a `0.5` | Inclinación lateral |
| `pitch` | float | rad | `-0.5` a `0.5` | Inclinar adelante/atrás |
| `yaw` | float | rad | `-0.5` a `0.5` | Girar horizontalmente |
| `body_height` | float | m | `0.18` a `0.38` | Altura del cuerpo |

```js
// Mirar abajo
await client.post("/robot/pose", { roll: 0, pitch: -0.35, yaw: 0, body_height: 0.28 });

// Ladear a la derecha
await client.post("/robot/pose", { roll: -0.25, pitch: 0, yaw: 0, body_height: 0.28 });

// Agacharse
await client.post("/robot/pose", { roll: 0, pitch: 0, yaw: 0, body_height: 0.20 });

// Estirado alto
await client.post("/robot/pose", { roll: 0, pitch: 0, yaw: 0, body_height: 0.36 });

// Volver a neutral
await client.post("/robot/pose", { roll: 0, pitch: 0, yaw: 0, body_height: 0.28 });
```

---

## Marcha

### `POST /robot/gait`

api_id `2001`.

| `gait_type` | Nombre | Descripción |
|-------------|--------|-------------|
| `0` | Normal | Marcha estándar |
| `1` | Trot | Trote rápido, superficies planas |
| `2` | Climb | Para subir pendientes |
| `3` | Stairs | Optimizado para escalones |

```js
await client.post("/robot/gait", { gait_type: 0 });
await client.post("/robot/gait", { gait_type: 1 });
```

---

### `POST /robot/speed_level`

SDK: `SportClient.SpeedLevel()` — api_id `1015`.

```js
await client.post("/robot/speed_level", null, { params: { level: 0 } }); // normal
await client.post("/robot/speed_level", null, { params: { level: 1 } }); // rápido
```

---

## Evasión de obstáculos

Servicio `obstacles_avoid` (API v1.0.0.2).
**No usar simultáneamente con SportClient — son excluyentes.**

### `POST /robot/obstacle_avoidance`

```js
await client.post("/robot/obstacle_avoidance", null, { params: { enabled: true } });
await client.post("/robot/obstacle_avoidance", null, { params: { enabled: false } });
```

### `GET /robot/obstacle_avoidance`

```js
const res = await client.get("/robot/obstacle_avoidance");
// res.data.data → { "obstacle_avoidance": true }
```

---

## VUI (luces y volumen)

### `POST /robot/led`

Brillo del LED. Rango: `0` (apagado) a `255` (máximo).

```js
await client.post("/robot/led", { brightness: 255 });
await client.post("/robot/led", { brightness: 0 });
```

---

### `POST /robot/volume`

Volumen del speaker. Rango: `0` (silencio) a `100` (máximo).

```js
await client.post("/robot/volume", { volume: 80 });
await client.post("/robot/volume", { volume: 0 });
```

---

## Endpoint genérico: `POST /robot/sport_cmd`

Ejecuta cualquier comando del SDK usando el `api_id` directo.

```js
await client.post("/robot/sport_cmd", { api_id: 1016, parameter: null });

// Con parámetro
await client.post("/robot/sport_cmd", { api_id: 2044, parameter: { flag: true } });
```

`parameter` puede omitirse o ser `null` cuando el comando no lleva argumentos.

---

### `GET /robot/sport_api_ids`

Lista completa de api_ids soportados.

```js
const res = await client.get("/robot/sport_api_ids");
// res.data.data.apis → [ { "id": 1001, "name": "damp" }, ... ]
```

---

## Tabla completa de api_id

| api_id | Método SDK | `parameter` | Descripción |
|--------|-----------|-------------|-------------|
| `1001` | `Damp()` | — | Relajar motores |
| `1002` | `BalanceStand()` | — | Balance dinámico en pie |
| `1003` | `StopMove()` | — | Detener movimiento |
| `1004` | `StandUp()` | — | Pararse |
| `1005` | `StandDown()` | — | Acostarse |
| `1006` | `RecoveryStand()` | — | Recuperar postura |
| `1007` | `Euler(r,p,y)` | `{"x": roll, "y": pitch, "z": yaw}` | Orientación del cuerpo |
| `1008` | `Move(vx,vy,vyaw)` | `{"x": vx, "y": vy, "z": vyaw}` | Velocidad continua |
| `1009` | `Sit()` | — | Sentarse |
| `1010` | `RiseSit()` | — | Levantarse del sit |
| `1015` | `SpeedLevel(lvl)` | `{"level": 0-1}` | Nivel de velocidad |
| `1016` | `Hello()` | — | Saludo / wave |
| `1017` | `Stretch()` | — | Estirarse |
| `1020` | `Content()` | — | Gesto de satisfacción |
| `1022` | `Dance1()` | — | Baile 1 |
| `1023` | `Dance2()` | — | Baile 2 |
| `1027` | `SwitchJoystick(on)` | `{"on": bool}` | Habilitar/deshabilitar mando físico |
| `1028` | `Pose(flag)` | `{"flag": bool}` | Modo pose estática on/off |
| `1029` | `Scrape()` | — | Rascar el suelo |
| `1030` | `FrontFlip()` | — | ⚠️ Salto mortal adelante |
| `1031` | `FrontJump()` | — | ⚠️ Salto hacia adelante |
| `1032` | `FrontPounce()` | — | ⚠️ Abalanzarse |
| `1036` | `Heart()` | — | Gesto corazón |
| `1061` | `StaticWalk()` | — | Marcha lenta y estable |
| `1062` | `TrotRun()` | — | Trote rápido |
| `2041` | `LeftFlip()` | — | ⚠️ Flip lateral izquierdo |
| `2043` | `BackFlip()` | — | ⚠️ Salto mortal atrás |
| `2044` | `HandStand(flag)` | `{"flag": bool}` | ⚠️ Pararse de manos on/off |
| `2045` | `FreeWalk()` | — | Caminar autónomo |
| `2046` | `FreeBound(flag)` | `{"flag": bool}` | Bounding gait on/off |
| `2047` | `FreeJump(flag)` | `{"flag": bool}` | Saltos autónomos on/off |
| `2048` | `FreeAvoid(flag)` | `{"flag": bool}` | Evasión autónoma on/off |
| `2049` | `ClassicWalk(flag)` | `{"flag": bool}` | Marcha clásica on/off |
| `2050` | `WalkUpright(flag)` | `{"flag": bool}` | Postura erguida on/off |
| `2051` | `CrossStep(flag)` | `{"flag": bool}` | Paso cruzado on/off |
| `2054` | `AutoRecoverySet(en)` | `{"enabled": bool}` | Auto-recovery on/off |
| `2055` | `AutoRecoveryGet()` | — | Consultar estado auto-recovery |
| `2058` | `SwitchAvoidMode()` | — | Toggle modo evasión |

---

## Ejemplos de sport_cmd agrupados

```js
// ── Gestos ──────────────────────────────────────────────────────────
await client.post("/robot/sport_cmd", { api_id: 1016 }); // Hello
await client.post("/robot/sport_cmd", { api_id: 1017 }); // Stretch
await client.post("/robot/sport_cmd", { api_id: 1020 }); // Content
await client.post("/robot/sport_cmd", { api_id: 1036 }); // Heart
await client.post("/robot/sport_cmd", { api_id: 1029 }); // Scrape
await client.post("/robot/sport_cmd", { api_id: 1009 }); // Sit
await client.post("/robot/sport_cmd", { api_id: 1010 }); // RiseSit

// ── Bailes ──────────────────────────────────────────────────────────
await client.post("/robot/sport_cmd", { api_id: 1022 }); // Dance1
await client.post("/robot/sport_cmd", { api_id: 1023 }); // Dance2

// ── Acrobacias (⚠️ requieren ~2m libres alrededor) ──────────────────
await client.post("/robot/sport_cmd", { api_id: 1030 }); // FrontFlip
await client.post("/robot/sport_cmd", { api_id: 2043 }); // BackFlip
await client.post("/robot/sport_cmd", { api_id: 2041 }); // LeftFlip
await client.post("/robot/sport_cmd", { api_id: 1031 }); // FrontJump
await client.post("/robot/sport_cmd", { api_id: 1032 }); // FrontPounce

// HandStand toggle
await client.post("/robot/sport_cmd", { api_id: 2044, parameter: { flag: true } });
await client.post("/robot/sport_cmd", { api_id: 2044, parameter: { flag: false } });

// ── Modos autónomos ─────────────────────────────────────────────────
await client.post("/robot/sport_cmd", { api_id: 2045 });                               // FreeWalk
await client.post("/robot/sport_cmd", { api_id: 2046, parameter: { flag: true } });   // FreeBound ON
await client.post("/robot/sport_cmd", { api_id: 2047, parameter: { flag: true } });   // FreeJump ON
await client.post("/robot/sport_cmd", { api_id: 2048, parameter: { flag: true } });   // FreeAvoid ON
await client.post("/robot/sport_cmd", { api_id: 2050, parameter: { flag: true } });   // WalkUpright ON
await client.post("/robot/sport_cmd", { api_id: 2051, parameter: { flag: true } });   // CrossStep ON

// ── Marchas especiales ──────────────────────────────────────────────
await client.post("/robot/sport_cmd", { api_id: 1061 });                               // StaticWalk
await client.post("/robot/sport_cmd", { api_id: 1062 });                               // TrotRun
await client.post("/robot/sport_cmd", { api_id: 2049, parameter: { flag: true } });   // ClassicWalk ON

// ── Configuración ───────────────────────────────────────────────────
await client.post("/robot/sport_cmd", { api_id: 1002 });                               // BalanceStand
await client.post("/robot/sport_cmd", { api_id: 1027, parameter: { on: false } });    // Joystick OFF
await client.post("/robot/sport_cmd", { api_id: 2054, parameter: { enabled: true } });// AutoRecovery ON
await client.post("/robot/sport_cmd", { api_id: 2055 });                               // AutoRecovery GET
```

---

## Navegación posicional

Disponible cuando `obstacles_avoid` está activo.

### Modo 1 — posición incremental (relativa al robot)

```js
// 1 metro adelante desde posición actual
await client.post("/robot/sport_cmd", {
  api_id: 1003,
  parameter: { x: 1.0, y: 0.0, yaw: 0.0, mode: 1 },
});

// Girar 90° a la izquierda
await client.post("/robot/sport_cmd", {
  api_id: 1003,
  parameter: { x: 0.0, y: 0.0, yaw: 1.5708, mode: 1 },
});
```

### Modo 2 — posición absoluta (coordenadas globales)

Requiere localización activa en el robot (SLAM/odometría inicializada).

```js
// Ir a la coordenada (2.0, 1.5) mirando a 45°
await client.post("/robot/sport_cmd", {
  api_id: 1003,
  parameter: { x: 2.0, y: 1.5, yaw: 0.785, mode: 2 },
});
```

---

## Códigos de error

| `code` | Descripción |
|--------|-------------|
| `0` | Éxito |
| `1002` | Estado incorrecto — el robot está en un modo incompatible con el comando |
| `3203` | `api_id` desconocido en el firmware del robot |
| `4101` | Datos de trayectoria inválidos |
| `4201` | Timeout del servicio sport en el robot |
| `4202` | Servicio sport no inicializado |

---

## `POST /robot/reset`

Solo disponible en el mock. Resetea el estado interno al inicial.

```js
await client.post("/robot/reset");
```

---

## Notas de compatibilidad de firmware

Los api_id `1061`, `1062` y todos los `2xxx` requieren firmware **Go2 v1.1.6 o superior**.
En versiones anteriores el robot devuelve `code: 3203`.

Los api_id `1001`–`1036` funcionan en todos los firmwares.
