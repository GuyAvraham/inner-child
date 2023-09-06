import { useMemo } from 'react';
import { View } from 'react-native';
import { ProgressChart } from 'react-native-chart-kit';

import Text from './Text';

interface ProgressCircleProps {
  value: number;
}

export function ProgressCircle({ value }: ProgressCircleProps) {
  const correctValue = useMemo(() => {
    if (value > 1) return 1;
    if (value < 0) return 0;
    return value;
  }, [value]);

  return (
    <View className="relative items-center justify-center">
      <ProgressChart
        hideLegend
        data={[0, correctValue]}
        width={110}
        height={110}
        strokeWidth={12}
        chartConfig={{
          backgroundGradientFromOpacity: 0,
          backgroundGradientToOpacity: 0,
          color: (opacity = 1, index) => {
            if (index !== 1) return 'transparent';
            return `rgba(255, 255, 255, ${opacity})`;
          },
        }}
      />
      <Text className="absolute font-[Poppins] text-lg">{Number(correctValue * 100).toFixed(0)}%</Text>
    </View>
  );
}
