import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

const usePulseAnimation = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.out(Easing.quad), // Slow down as it reaches the top
          useNativeDriver: true,
        }),
        Animated.delay(300), // Add a delay at the top of the pulse
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.quad), // Slow down as it reaches the bottom
          useNativeDriver: true,
        }),
        Animated.delay(300), // Add a delay at the bottom of the pulse
      ])
    ).start();
  }, [pulseAnim]);

  return pulseAnim;
};

export default usePulseAnimation;