import * as React from "react";
import { View, Pressable, Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { ICarouselInstance } from "react-native-reanimated-carousel";
import Carousel from "react-native-reanimated-carousel";

export default function CarouselView({data}: {data: any}) {
    const carouselRef = React.useRef<ICarouselInstance>(null);
    const width = Dimensions.get("window").width;

  return (
    <View style={{ flex: 1 }}>
        <Carousel
            ref={carouselRef}
            className="items-center justify-center self-center w-full"
            width={width/1.5}
            data={data}
            loop={false}
            renderItem={({ index, animationValue }) => {
                return (
                    <Item
                    animationValue={animationValue}
                    size={width}
                    label={data[index].age}
                    uri={data[index].uri}
                    onPress={() =>
                        carouselRef.current?.scrollTo({
                        count: animationValue.value,
                        animated: true,
                        })
                    }
                    />
                );
            }}
        />
    </View>
  );
}

interface Props {
  animationValue: Animated.SharedValue<number>
  uri: string
  size: number,
  label: string
  onPress?: () => void
}

const Item: React.FC<Props> = (props) => {
  const { animationValue, uri, size, onPress, label } = props;
  const offset = 125;

  const translateY = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => { 
    const scale = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [1, 1.25, 1],
        Extrapolate.CLAMP,
    );
    const opacity = interpolate(
        animationValue.value,
        [-1, 0, 1],
        [0.2, 1, 0.2],
        Extrapolate.CLAMP,
    );

    return {
        transform: [{ scale }, { translateY: translateY.value }],
        opacity
    };
  }, [animationValue]);

  const labelStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [1, 1.25, 1],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{ scale }, { translateY: translateY.value }],
    };
  }, [animationValue, translateY]);

  const onPressIn = React.useCallback(() => {
    translateY.value = withTiming(-8, { duration: 250 });
  }, [translateY]);

  const onPressOut = React.useCallback(() => {
    translateY.value = withTiming(0, { duration: 250 });
  }, [translateY]);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View
        style={[
            containerStyle
        ]}
        className="items-center justify-center h-full"
      >
        <Animated.Image
            className="rounded-3xl"
            source={{ uri: uri }}
            width={size - offset}
            height={size}
        />
        <Animated.Text className=" text-md" style={[labelStyle]}>{label}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
};