# Documentación de API — Unitree Robot API

> Base URL: `http://<IP_DEL_SERVIDOR>:8000`
>
> Todos los endpoints marcados con 🔒 requieren el header `Authorization: Bearer <token>`.

---

## Autenticación

### `POST /auth/register`
Registra un nuevo usuario.

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `username` | string | ✅ | Nombre de usuario |
| `email` | string | ✅ | Email del usuario |
| `password` | string | ✅ | Contraseña |

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `201` | Registro exitoso | `{ username, email }` |
| `409` | Username o email ya existente | `{ detail }` |
| `422` | Campos inválidos o faltantes | `{ detail }` |

---

### `POST /auth/token`
Inicia sesión y devuelve un JWT.

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `identifier` | string | ✅ | Username **o** email |
| `password` | string | ✅ | Contraseña |

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | Login exitoso | `{ access_token, token_type: "bearer" }` |
| `401` | Credenciales incorrectas | `{ detail }` |
| `422` | Campos inválidos o faltantes | `{ detail }` |

---

## Conexión 🔒

### `POST /connect`
Conecta la app al robot.

**Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `robot_type` | string | ✅ | `"go2"` o `"g1"` |
| `network_interface` | string | ❌ | Interfaz de red. Default: `"eth0"` |

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | Conexión exitosa | `{ success: true, robot_type, connected_at }` |
| `409` | Robot ya conectado | `{ detail }` |
| `422` | Campos inválidos o faltantes | `{ detail }` |

---

### `POST /disconnect`
Desconecta el robot.

**Body:** ninguno

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | Desconexión exitosa | `{ success: true }` |
| `409` | Robot no estaba conectado | `{ detail }` |

---

### `GET /status`
Devuelve el estado actual de la conexión.

**Body:** ninguno

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | OK | ver campos abajo |

**Campos del body `200`:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `connection_state` | string | `"connected"`, `"disconnected"` o `"error"` |
| `robot_type` | string \| null | `"go2"`, `"g1"` o `null` si no hay conexión |
| `network_interface` | string \| null | Interfaz en uso o `null` |
| `connected_at` | string \| null | Timestamp ISO de la conexión o `null` |
| `last_error` | string \| null | Mensaje del último error o `null` |

---

## Movimiento 🔒

### `POST /move`
Envía velocidades de movimiento al robot.

**Body:**
| Campo | Tipo | Requerido | Rango | Descripción |
|-------|------|-----------|-------|-------------|
| `vx` | number | ✅ | `-1.0` a `1.0` | Velocidad adelante/atrás (m/s) |
| `vy` | number | ✅ | `-1.0` a `1.0` | Velocidad lateral (m/s) |
| `vyaw` | number | ✅ | `-3.14` a `3.14` | Velocidad angular (rad/s) |

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | Comando enviado | `{ success: true }` |
| `409` | Robot no conectado | `{ detail }` |
| `422` | Valores fuera de rango | `{ detail }` |

---

### `POST /stop`
Detiene el movimiento del robot.

**Body:** ninguno

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | OK | `{ success: true }` |
| `409` | Robot no conectado | `{ detail }` |

---

### `POST /standup`
Ordena al robot que se ponga de pie.

**Body:** ninguno

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | OK | `{ success: true }` |
| `409` | Robot no conectado | `{ detail }` |

---

### `POST /sitdown`
Ordena al robot que se siente.

**Body:** ninguno

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | OK | `{ success: true }` |
| `409` | Robot no conectado | `{ detail }` |

---

### `POST /damp`
Pone todos los motores en modo amortiguado (flojo). Útil para apagado seguro.

**Body:** ninguno

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | OK | `{ success: true }` |
| `409` | Robot no conectado | `{ detail }` |

---

### Endpoints de modo toggle

Los siguientes endpoints activan o desactivan un modo específico del robot. Todos reciben el mismo body y devuelven la misma respuesta.

| Endpoint | Descripción | Robot compatible |
|----------|-------------|-----------------|
| `POST /handstand` | Parado en manos | Go2 |
| `POST /freebound` | Modo salto libre | Go2 |
| `POST /freeavoid` | Modo evasión libre | Go2 |
| `POST /walkupright` | Caminar erguido | G1 |
| `POST /crossstep` | Paso cruzado | Go2 / G1 |
| `POST /freejump` | Salto libre | Go2 |

**Body (todos):**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `enable` | boolean | ✅ | `true` para activar, `false` para desactivar |

**Respuestas (todos):**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | OK | `{ success: true }` |
| `409` | Robot no conectado | `{ detail }` |
| `422` | Campos inválidos | `{ detail }` |

---

## Acciones 🔒

### `GET /actions`
Lista las acciones disponibles según el tipo de robot conectado.

**Body:** ninguno

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | OK | `{ robot_type, actions: string[] }` |
| `409` | Robot no conectado | `{ detail }` |

**Acciones por robot:**
| Robot | Acciones |
|-------|----------|
| `go2` | `hello`, `stretch`, `dance1`, `dance2`, `heart`, `flips`, `balance_stand`, `recovery_stand` |
| `g1` | `wave_hand`, `wave_hand_turn`, `shake_hand`, `high_stand`, `low_stand`, `release_arm`, `shake_hand_arm`, `high_five`, `hug`, `clap` |

---

### `POST /action/{action_name}`
Ejecuta una acción por su nombre.

**Parámetro de ruta:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `action_name` | string | Nombre de la acción a ejecutar (ej: `hello`, `dance1`) |

**Body:** ninguno

**Respuestas:**
| Código | Descripción | Body |
|--------|-------------|------|
| `200` | Acción ejecutada | `{ success: true, action: string }` |
| `404` | Acción no soportada por el robot conectado | `{ detail }` |
| `409` | Robot no conectado | `{ detail }` |

---

## Códigos de error — Resumen global

| Código | Situación |
|--------|-----------|
| `401` | Token ausente, inválido o expirado |
| `404` | Acción no soportada por el tipo de robot |
| `409` | Conflicto de estado: robot ya conectado, no conectado, o usuario ya existente |
| `422` | Body con campos faltantes, tipos incorrectos o valores fuera de rango |
| `503` | El SDK del robot devolvió un error interno |
