import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import usePulseAnimation from '../hooks/usePulseAnimation';

const CustomMarker = () => {
  const pulseAnim = usePulseAnimation();

  return (
    <View style={styles.outerCircle}>
      <Animated.View style={[styles.innerCircle, { transform: [{ scale: pulseAnim }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  outerCircle: {
    width: 21,
    height: 21,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 13,
    height: 13,
    borderRadius: 10,
    backgroundColor: '#007AFF',
  },
});

export default CustomMarker;