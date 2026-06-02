# Guía de limpieza — Integración de Funcionalidad 1

Este archivo documenta todos los cambios temporales hechos para testear la Funcionalidad 2
antes de que la Funcionalidad 1 esté implementada. Seguir estos pasos en orden cuando
el desarrollador de Feature 1 entregue su código.

---

## Paso 1 — Borrar esta carpeta completa

```
/test/
```

Todo lo que está acá es mock descartable. No tocar ningún otro archivo al hacer esto.

---

## Paso 2 — Reemplazar `context/RobotContext.js`

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

## Paso 3 — Actualizar `navigation/AppNavigator.js`

**Archivo:** `navigation/AppNavigator.js`

**Qué hay ahora:** Dos pantallas en el Stack: `Connection` (mock) y `Movement`.
`initialRouteName` apunta a `Connection`.

**Qué hacer:** 
1. Borrar el import de `ConnectionScreen` desde `@/test/screens/ConnectionScreen`.
2. Agregar las pantallas reales de Feature 1 (Login, Registro, Conexión real, etc.).
3. Cambiar `initialRouteName` a la pantalla inicial real (probablemente `Login`).
4. Mantener `Movement` en el Stack tal como está.

Ejemplo de cómo debería quedar la parte relevante:

```js
// Borrar esto:
import ConnectionScreen from '@/test/screens/ConnectionScreen';

// Agregar las pantallas de Feature 1:
import LoginScreen from '@/screens/LoginScreen';
import ConnectionScreen from '@/screens/ConnectionScreen'; // la real
```

---

## Paso 4 — Actualizar `App.js`

**Archivo:** `App.js`

**Qué hay ahora:** `RobotProvider` del mock envuelve todo.

**Qué hacer:**
1. Reemplazar el import de `RobotProvider` si Feature 1 lo mueve o renombra.
2. Agregar `AuthProvider` de Feature 1 envolviendo todo por fuera del `RobotProvider`.
3. Si Feature 1 tiene un provider propio para la conexión, integrar en la jerarquía correcta.

Ejemplo de estructura esperada:

```jsx
<AuthProvider>
  <RobotProvider>
    <NavigationContainer>
      <StatusBar ... />
      <AppNavigator />
    </NavigationContainer>
  </RobotProvider>
</AuthProvider>
```

---

## Resumen de archivos tocados

| Archivo | Tipo de cambio | Acción al integrar Feature 1 |
|---------|---------------|------------------------------|
| `test/` (toda la carpeta) | Nuevo — descartable | Borrar completo |
| `context/RobotContext.js` | Nuevo — temporal | Reemplazar con el de Feature 1 |
| `navigation/AppNavigator.js` | Modificado | Actualizar pantallas y ruta inicial |
| `App.js` | Modificado | Agregar `AuthProvider`, revisar providers |
