import { useState, useRef, useMemo, useEffect } from 'react';
import { View, Text, PanResponder } from 'react-native';
import styles, { JOYSTICK_RADIUS, KNOB_RADIUS } from './VirtualJoystick.styles';

const MAX_DISPLACEMENT = JOYSTICK_RADIUS - KNOB_RADIUS;

export default function VirtualJoystick({ disabled, onMove, onStop }) {
  const [knobOffset, setKnobOffset] = useState({ x: 0, y: 0 });
  const valuesRef = useRef({ x: 0, y: 0 });
  const disabledRef = useRef(disabled);

  useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabledRef.current,
        onMoveShouldSetPanResponder: () => !disabledRef.current,
        onPanResponderMove: (_, gestureState) => {
          const dist = Math.sqrt(gestureState.dx ** 2 + gestureState.dy ** 2);
          const scale = dist > MAX_DISPLACEMENT ? MAX_DISPLACEMENT / dist : 1;
          const dx = gestureState.dx * scale;
          const dy = gestureState.dy * scale;
          setKnobOffset({ x: dx, y: dy });
          valuesRef.current = { x: dx / MAX_DISPLACEMENT, y: dy / MAX_DISPLACEMENT };
          onMove?.(-valuesRef.current.y, 0, -valuesRef.current.x);
        },
        onPanResponderRelease: () => {
          setKnobOffset({ x: 0, y: 0 });
          valuesRef.current = { x: 0, y: 0 };
          onStop?.();
        },
        onPanResponderTerminate: () => {
          setKnobOffset({ x: 0, y: 0 });
          valuesRef.current = { x: 0, y: 0 };
          onStop?.();
        },
      }),
    [],
  );

  return (
    <View style={styles.wrapper}>
      <Text style={styles.hint}>Eje Y → adelante/atrás · Eje X → rotación</Text>
      <View
        style={[styles.outer, disabled && styles.outerDisabled]}
        {...panResponder.panHandlers}
      >
        <View
          style={[
            styles.knob,
            disabled && styles.knobDisabled,
            { transform: [{ translateX: knobOffset.x }, { translateY: knobOffset.y }] },
          ]}
        />
      </View>
      {disabled && <Text style={styles.disabledText}>Deshabilitado</Text>}
    </View>
  );
}
