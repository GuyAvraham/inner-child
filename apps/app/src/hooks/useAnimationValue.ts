import { useEffect, useRef, useState } from 'react';
import { Animated, LayoutAnimation } from 'react-native';

export function useAnimationValue() {
  const [progressTime, setProgressTime] = useState(0);
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timeouts = [] as NodeJS.Timeout[];

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

    setTimeout(() => {
      Animated.timing(animationValue, {
        toValue: 0.15,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 1000);

    setTimeout(() => {
      Animated.timing(animationValue, {
        toValue: 0.36,
        duration: 2500,
        useNativeDriver: true,
      }).start();
    }, 5000);

    setTimeout(() => {
      Animated.timing(animationValue, {
        toValue: 0.62,
        duration: 2000,
        useNativeDriver: true,
      }).start();
    }, 12000);

    setTimeout(() => {
      Animated.timing(animationValue, {
        toValue: 0.87,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 19000);

    setTimeout(() => {
      Animated.timing(animationValue, {
        toValue: 0.99,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, 25000);

    animationValue.addListener(({ value }) => {
      setProgressTime(value);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      animationValue.removeAllListeners();
    };
  }, [animationValue]);

  return progressTime;
}
