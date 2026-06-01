# Unitree G1 (Humanoide) — API Reference

Documentación de endpoints para controlar el robot humanoide Unitree G1.
Basada en [`unitree_sdk2_python`](https://github.com/unitreerobotics/unitree_sdk2_python/tree/master),
`g1_loco_client.py`, `g1_arm_action_client.py` y `g1_audio_client.py`.

---

## Diferencias clave vs. Go2 (perro)

El G1 usa un cliente distinto: `LocoClient` en lugar de `SportClient`.
Los `api_id` son completamente diferentes (serie `7xxx` en lugar de `1xxx`/`2xxx`).
Tiene servicios adicionales exclusivos: brazos (`arm`) y audio/TTS (`voice`).

| Servicio | Nombre DDS | Descripción |
|----------|-----------|-------------|
| Locomoción | `sport` | Caminar, pararse, sentarse, gestos con brazos |
| Acciones de brazos | `arm` | Gestos predefinidos de brazos/manos |
| Audio / LED | `voice` | Text-to-speech, volumen, LED RGB |

---

## Base URL

```
Desarrollo (mock):  http://localhost:8080
Robot real (AP):    http://192.168.8.1:8082
```

---

## Formato de respuesta universal

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
```

---

## WebSocket — solo telemetría

El WebSocket **no tiene relación con los comandos de control**.
Todo movimiento, gestos y configuración son `POST` HTTP normales.

Sirve únicamente para leer el estado del robot en tiempo real.
Si no necesitás esos datos en vivo, usá `GET /robot/state` por polling.

Endpoint: `ws://localhost:8080/ws/state` — emite estado cada 100ms.

```js
const ws = new WebSocket("ws://localhost:8080/ws/state");

ws.onmessage = (event) => {
  const state = JSON.parse(event.data);
  // state.mode, state.battery, state.body_height,
  // state.velocity.vx/vy/vyaw,
  // state.body_attitude.roll/pitch/yaw,
  // state.imu, state.error_code
};
```

---

## Telemetría (HTTP)

### `GET /robot/state`

Estado completo del robot.

```js
const res = await client.get("/robot/state");
const state = res.data.data;
```

Respuesta `data`:

```json
{
  "mode": "standing",
  "fsm_id": 200,
  "balance_mode": 0,
  "stand_height": 4294967295,
  "swing_height": 0.08,
  "body_height": 0.75,
  "position": { "x": 0.0, "y": 0.0, "z": 0.0 },
  "velocity": { "vx": 0.0, "vy": 0.0, "vyaw": 0.0 },
  "body_attitude": { "roll": 0.0, "pitch": 0.0, "yaw": 0.0 },
  "imu": {
    "quaternion": [1.0, 0.0, 0.0, 0.0],
    "gyroscope": [0.0, 0.0, 0.0],
    "accelerometer": [0.01, -0.02, 9.81],
    "rpy": [0.0, 0.0, 0.0],
    "temperature": 38
  },
  "error_code": 0,
  "battery": 92.0
}
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `mode` | string | `zero_torque` / `damping` / `sitting` / `standing` / `walking` |
| `fsm_id` | int | Estado actual de la máquina de estados interna |
| `balance_mode` | int | Modo de balance activo |
| `stand_height` | uint32 | Altura de pie: `0`=mínima, `4294967295`=máxima |
| `swing_height` | float | Altura del paso (m) |
| `battery` | float | Batería (0–100) |
| `velocity.vx` | float | Velocidad adelante/atrás (m/s) |
| `velocity.vy` | float | Velocidad lateral (m/s) |
| `velocity.vyaw` | float | Velocidad rotacional (rad/s) |
| `error_code` | int | 0 = sin errores |

---

### `GET /robot/battery`

```js
const res = await client.get("/robot/battery");
// res.data.data → { "battery": 92.0, "charging": false }
```

---

### `GET /robot/imu`

```js
const res = await client.get("/robot/imu");
// res.data.data → { "acc": [ax, ay, az], "gyro": [gx, gy, gz], "rpy": [roll, pitch, yaw] }
```

---

### `GET /robot/log`

Historial de los últimos 50 comandos recibidos.

```js
const res = await client.get("/robot/log");
// res.data.data → { "count": 8, "log": [ { "time": "...", "action": "...", "params": {...} } ] }
```

---

## Control de locomoción (LocoClient — servicio `sport`)

### Secuencia de arranque obligatoria

El G1 arranca siempre en `zero_torque`. Hay que seguir esta secuencia:

```
ESTADO INICIAL: zero_torque (fsm_id: 0)
      │
      ▼  POST /robot/damp        (fsm_id: 1)
      │  esperar 500ms
      ▼  POST /robot/start       (fsm_id: 200)
      │  esperar 2000ms  ← el robot se levanta
      ▼  ROBOT LISTO
```

```js
await client.post("/robot/damp");
await new Promise(r => setTimeout(r, 500));

await client.post("/robot/start");
await new Promise(r => setTimeout(r, 2000));
```

---

### FSM — Estados de la máquina de estados

El G1 usa una FSM (Finite State Machine) internamente.
Todos los comandos de postura son transiciones de estado via `fsm_id`.

| fsm_id | Método SDK | Estado |
|--------|-----------|--------|
| `0` | `ZeroTorque()` | Torque cero — motores libres |
| `1` | `Damp()` | Damping — motores resistivos, postura segura |
| `3` | `Sit()` | Sentado |
| `200` | `Start()` | Listo / parado erguido |
| `702` | `Lie2StandUp()` | Levantarse desde el suelo |
| `706` | `Squat2StandUp()` / `StandUp2Squat()` | Transición parado ↔ cuclillas |

---

### `POST /robot/zero_torque`

Desactiva todos los motores. SDK: `ZeroTorque()` — fsm_id `0`.

> ⚠️ El robot cae si está de pie. Usar solo cuando está siendo sostenido o en el suelo.

```js
await client.post("/robot/zero_torque");
```

---

### `POST /robot/damp`

Modo damping — motores resistivos, postura de descanso segura. SDK: `Damp()` — fsm_id `1`.

```js
await client.post("/robot/damp");
// res.data.data → { "mode": "damping", "fsm_id": 1 }
```

---

### `POST /robot/start`

Activar controlador de locomoción / pararse erguido. SDK: `Start()` — fsm_id `200`.

```js
await client.post("/robot/start");
// res.data.data → { "mode": "standing", "fsm_id": 200 }
```

---

### `POST /robot/sit`

Sentarse. SDK: `Sit()` — fsm_id `3`.

```js
await client.post("/robot/sit");
// res.data.data → { "mode": "sitting", "fsm_id": 3 }
```

---

### `POST /robot/lie_to_stand`

Levantarse desde el suelo (boca arriba/abajo). SDK: `Lie2StandUp()` — fsm_id `702`.

```js
await client.post("/robot/lie_to_stand");
```

---

### `POST /robot/squat`

Transición parado ↔ cuclillas. SDK: `Squat2StandUp()` / `StandUp2Squat()` — fsm_id `706`.

```js
await client.post("/robot/squat"); // parado → cuclillas
await client.post("/robot/squat"); // cuclillas → parado (llamada nuevamente)
```

---

### `POST /robot/stop_move`

Detener todo movimiento (velocidad cero). SDK: `StopMove()`.

```js
await client.post("/robot/stop_move");
```

---

## Movimiento

### `POST /robot/move`

Control de velocidad. SDK: `LocoClient.Move(vx, vy, vyaw, continous_move)` — api_id `7105`.

> Nota: cuando `continous_move` es `false`, el comando expira en 1 segundo y debe
> repetirse en loop para movimiento continuo. Cuando es `true`, el comando dura
> indefinidamente hasta que se envíe otro.

**Prerrequisito:** el robot debe estar en `standing` (fsm_id 200).

Body:

```json
{ "vx": 0.3, "vy": 0.0, "vyaw": 0.0, "continuous": true }
```

| Parámetro | Tipo | Unidad | Rango | Descripción |
|-----------|------|--------|-------|-------------|
| `vx` | float | m/s | `-0.5` a `0.5` | Adelante (+) / atrás (-) |
| `vy` | float | m/s | `-0.5` a `0.5` | Izquierda (+) / derecha (-) |
| `vyaw` | float | rad/s | `-1.0` a `1.0` | Antihorario (+) / horario (-) |
| `continuous` | bool | — | — | `true` = comando persistente, `false` = expira en 1s |

```js
// Adelante continuo
await client.post("/robot/move", { vx: 0.3, vy: 0, vyaw: 0, continuous: true });

// Atrás
await client.post("/robot/move", { vx: -0.3, vy: 0, vyaw: 0, continuous: true });

// Girar en el lugar (horario)
await client.post("/robot/move", { vx: 0, vy: 0, vyaw: -0.8, continuous: true });

// Lateral izquierda
await client.post("/robot/move", { vx: 0, vy: 0.3, vyaw: 0, continuous: true });

// Parar
await client.post("/robot/move", { vx: 0, vy: 0, vyaw: 0, continuous: true });
// equivalente a:
await client.post("/robot/stop_move");
```

---

## Altura de pie

### `POST /robot/stand_height`

Ajusta la altura del G1 mientras está parado. SDK: `SetStandHeight()` — api_id `7104`.

La altura se representa internamente como `uint32`:
- `0` = altura mínima (cuclillas)
- `4294967295` = altura máxima (completamente estirado)

```js
// Altura máxima (HighStand)
await client.post("/robot/stand_height", { height: 4294967295 });

// Altura mínima (LowStand)
await client.post("/robot/stand_height", { height: 0 });

// Altura media (~50%)
await client.post("/robot/stand_height", { height: 2147483648 });
```

---

## Altura del paso (swing height)

### `POST /robot/swing_height`

Altura a la que el robot levanta los pies al caminar. SDK: `SetSwingHeight()` — api_id `7103`.

```json
{ "height": 0.08 }
```

| `height` (m) | Efecto |
|-------------|--------|
| `0.04` | Paso bajo, más estable |
| `0.08` | Default |
| `0.12` | Paso alto, terrenos irregulares |

```js
await client.post("/robot/swing_height", { height: 0.08 });
```

---

## Balance mode

### `POST /robot/balance_mode`

Modo de control de balance. SDK: `SetBalanceMode()` — api_id `7102`.

```json
{ "mode": 0 }
```

| `mode` | Descripción |
|--------|-------------|
| `0` | Balance normal |
| `1` | Balance con mayor rigidez |

```js
await client.post("/robot/balance_mode", { mode: 0 });
```

---

## Gestos con brazos vía LocoClient

### `POST /robot/wave_hand`

Saludo con la mano. SDK: `WaveHand(turn_flag)` — task_id `0` o `1` via api_id `7106`.

```json
{ "turn": false }
```

| `turn` | task_id | Descripción |
|--------|---------|-------------|
| `false` | `0` | Saludar sin girar |
| `true` | `1` | Saludar y girar 180° |

```js
await client.post("/robot/wave_hand", { turn: false }); // saludo simple
await client.post("/robot/wave_hand", { turn: true });  // saludo + giro
```

---

### `POST /robot/shake_hand`

Dar la mano. SDK: `ShakeHand(stage)` — task_id `2` o `3` via api_id `7106`.

Tiene dos etapas: extender la mano (stage 0) y retraer (stage 1).

```json
{ "stage": 0 }
```

| `stage` | task_id | Descripción |
|---------|---------|-------------|
| `0` | `2` | Extender la mano |
| `1` | `3` | Retraer la mano |

```js
await client.post("/robot/shake_hand", { stage: 0 }); // extender
await client.post("/robot/shake_hand", { stage: 1 }); // retraer
```

---

## Endpoint genérico de locomoción: `POST /robot/loco_cmd`

Para enviar cualquier comando FSM o de parámetros directamente.

```json
{ "api_id": 7101, "parameter": { "fsm_id": 200 } }
```

```js
// Transición de FSM directa
await client.post("/robot/loco_cmd", { api_id: 7101, parameter: { fsm_id: 200 } });

// SetVelocity raw
await client.post("/robot/loco_cmd", {
  api_id: 7105,
  parameter: { x: 0.3, y: 0.0, yaw: 0.0, duration: 864000 }
});

// SetTaskId (arm gesture)
await client.post("/robot/loco_cmd", { api_id: 7106, parameter: { task: 0.0 } });
```

---

## Tabla de api_id de locomoción (LocoClient)

Extraída de `g1_loco_api.py` y `g1_loco_client.py`.

| api_id | Tipo | Parámetro JSON | Descripción |
|--------|------|----------------|-------------|
| `7001` | GET | — | Consultar fsm_id actual |
| `7002` | GET | — | Consultar modo FSM |
| `7003` | GET | — | Consultar balance_mode |
| `7004` | GET | — | Consultar swing_height |
| `7005` | GET | — | Consultar stand_height |
| `7101` | SET | `{"fsm_id": int}` | Cambiar estado FSM |
| `7102` | SET | `{"balance_mode": int}` | Cambiar balance mode |
| `7103` | SET | `{"swing_height": float}` | Cambiar altura del paso |
| `7104` | SET | `{"stand_height": float}` | Cambiar altura de pie |
| `7105` | SET | `{"x": vx, "y": vy, "yaw": vyaw, "duration": float}` | Velocidad de movimiento |
| `7106` | SET | `{"task": float}` | Ejecutar tarea de brazo |

---

## Acciones de brazos (G1ArmActionClient — servicio `arm`)

Gestos predefinidos de brazos/manos. Servicio: `arm`, API v`1.0.0.0`.

### `POST /robot/arm_action`

Ejecuta una acción de brazo por ID. SDK: `G1ArmActionClient.ExecuteAction(action_id)` — api_id `7106`.

```json
{ "action_id": 17 }
```

| `action_id` | Nombre | Descripción |
|-------------|--------|-------------|
| `11` | two-hand kiss | Mandar beso con ambas manos |
| `12` | left kiss | Mandar beso con mano izquierda |
| `13` | right kiss | Mandar beso con mano derecha |
| `15` | hands up | Levantar ambas manos |
| `17` | clap | Aplaudir |
| `18` | high five | Choque de manos (high five) |
| `19` | hug | Abrir brazos para abrazar |
| `20` | heart | Hacer corazón con las manos |
| `21` | right heart | Corazón con mano derecha |
| `22` | reject | Gesto de rechazo |
| `23` | right hand up | Levantar mano derecha |
| `24` | x-ray | Pose de rayos X |
| `25` | face wave | Saludar frente a la cara |
| `26` | high wave | Saludar con brazo en alto |
| `27` | shake hand | Dar la mano |
| `99` | release arm | Soltar brazos a posición default |

```js
// Aplaudir
await client.post("/robot/arm_action", { action_id: 17 });

// Hacer corazón
await client.post("/robot/arm_action", { action_id: 20 });

// High five
await client.post("/robot/arm_action", { action_id: 18 });

// Levantar manos
await client.post("/robot/arm_action", { action_id: 15 });

// Soltar brazos (volver a postura normal)
await client.post("/robot/arm_action", { action_id: 99 });
```

---

### `GET /robot/arm_action_list`

Consultar lista de acciones disponibles. SDK: `G1ArmActionClient.GetActionList()` — api_id `7107`.

```js
const res = await client.get("/robot/arm_action_list");
// res.data.data → { "actions": [ { "id": 17, "name": "clap" }, ... ] }
```

---

## Audio y LED (AudioClient — servicio `voice`)

### `POST /robot/tts`

Text-to-speech. SDK: `AudioClient.TtsMaker(text, speaker_id)` — api_id `1001`.

```json
{ "text": "Hello, I am G1", "speaker_id": 0 }
```

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `text` | string | Texto a sintetizar (inglés o chino) |
| `speaker_id` | int | Voz: `0` = voz default, otros valores = voces alternativas |

```js
await client.post("/robot/tts", { text: "Hello, I am G1", speaker_id: 0 });
await client.post("/robot/tts", { text: "你好，我是G1", speaker_id: 0 });
```

---

### `GET /robot/volume`

Consultar volumen actual. SDK: `AudioClient.GetVolume()` — api_id `1005`.

```js
const res = await client.get("/robot/volume");
// res.data.data → { "volume": 70 }
```

---

### `POST /robot/volume`

Ajustar volumen (0–100). SDK: `AudioClient.SetVolume(volume)` — api_id `1006`.

```js
await client.post("/robot/volume", { volume: 80 });
await client.post("/robot/volume", { volume: 0 }); // silencio
```

---

### `POST /robot/led`

Control de LED RGB. SDK: `AudioClient.LedControl(R, G, B)` — api_id `1010`.

```json
{ "R": 0, "G": 255, "B": 0 }
```

| Parámetro | Tipo | Rango | Descripción |
|-----------|------|-------|-------------|
| `R` | int | `0`–`255` | Canal rojo |
| `G` | int | `0`–`255` | Canal verde |
| `B` | int | `0`–`255` | Canal azul |

```js
await client.post("/robot/led", { R: 0, G: 255, B: 0 });     // verde
await client.post("/robot/led", { R: 255, G: 0, B: 0 });     // rojo
await client.post("/robot/led", { R: 0, G: 0, B: 255 });     // azul
await client.post("/robot/led", { R: 255, G: 255, B: 255 }); // blanco
await client.post("/robot/led", { R: 0, G: 0, B: 0 });       // apagado
```

---

## Endpoint genérico de audio: `POST /robot/audio_cmd`

Para enviar comandos del servicio `voice` directamente por api_id.

```json
{ "api_id": 1006, "parameter": { "volume": 60 } }
```

```js
await client.post("/robot/audio_cmd", { api_id: 1006, parameter: { volume: 60 } });
```

---

## Tabla de api_id de audio (AudioClient)

Extraída de `g1_audio_api.py`.

| api_id | Método SDK | Parámetro JSON | Descripción |
|--------|-----------|----------------|-------------|
| `1001` | `TtsMaker()` | `{"index": int, "text": str, "speaker_id": int}` | Text-to-speech |
| `1003` | `PlayStream()` | `{"app_name": str, "stream_id": str}` + binary PCM | Reproducir audio PCM |
| `1004` | `PlayStop()` | `{"app_name": str}` | Detener reproducción |
| `1005` | `GetVolume()` | — | Consultar volumen |
| `1006` | `SetVolume()` | `{"volume": int}` | Ajustar volumen |
| `1010` | `LedControl()` | `{"R": int, "G": int, "B": int}` | Control LED RGB |

---

## `POST /robot/reset`

Solo disponible en el mock. Resetea el estado interno al inicial.

```js
await client.post("/robot/reset");
```

---

## Códigos de error

| `code` | Descripción |
|--------|-------------|
| `0` | Éxito |
| `1002` | Estado incorrecto — FSM incompatible con el comando |
| `3203` | `api_id` desconocido |
| `4201` | Timeout del servicio en el robot |
| `4202` | Servicio no inicializado |

---

## Notas importantes del G1

**Modo EDU requerido:** el SDK solo funciona con la versión EDU del G1. Las versiones consumer no exponen los servicios DDS.

**`continuous: true` en Move:** sin esto el comando de movimiento expira en 1 segundo. Para tele-operación continua mandar `continuous: true` o implementar un loop que reenvíe el comando cada ~800ms.

**Brazos excluyentes:** `LocoClient` (wave/shake) y `G1ArmActionClient` (gestos) controlan los mismos motores. No usar ambos simultáneamente.

**FSM estricta:** el G1 ignora comandos de movimiento si no está en fsm_id `200` (Start). Siempre verificar el estado antes de mandar velocidades.
