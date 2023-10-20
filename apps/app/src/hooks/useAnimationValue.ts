import { useEffect, useState } from 'react';
import { Animated, LayoutAnimation } from 'react-native';

import { isIos } from '~/config/variables';

export function useAnimationValue(fast?: boolean) {
  const [progressTime, setProgressTime] = useState(0);

  useEffect(() => {
    const timeouts = [] as NodeJS.Timeout[];
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const animationValue = new Animated.Value(0);
    const useNativeDriver = isIos;

    if (fast) {
      Animated.timing(animationValue, {
        toValue: 0.99,
        duration: 2000,
        useNativeDriver,
      }).start();
    } else {
      setTimeout(() => {
        Animated.timing(animationValue, {
          toValue: 0.15,
          duration: 1000,
          useNativeDriver,
        }).start();
      }, 1000);

      setTimeout(() => {
        Animated.timing(animationValue, {
          toValue: 0.36,
          duration: 2500,
          useNativeDriver,
        }).start();
      }, 5000);

      setTimeout(() => {
        Animated.timing(animationValue, {
          toValue: 0.62,
          duration: 2000,
          useNativeDriver,
        }).start();
      }, 12000);

      setTimeout(() => {
        Animated.timing(animationValue, {
          toValue: 0.87,
          duration: 1000,
          useNativeDriver,
        }).start();
      }, 19000);

      setTimeout(() => {
        Animated.timing(animationValue, {
          toValue: 0.99,
          duration: 1000,
          useNativeDriver,
        }).start();
      }, 25000);
    }

    animationValue.addListener(({ value }) => {
      setProgressTime(value);
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      animationValue.removeAllListeners();
    };
  }, [fast]);

  return progressTime;
}
