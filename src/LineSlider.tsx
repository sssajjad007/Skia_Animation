import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Path as PathSvg } from 'react-native-svg';
import { BlurMask, Canvas, Circle, Path, Rect, Skia, SweepGradient, useValue, vec } from '@shopify/react-native-skia';

import { Dimensions, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedPath = Animated.createAnimatedComponent(PathSvg);

export const LineSlider = () => {
  const strokeWidth = 20;
  const center = width / 2;
  const r = (width - strokeWidth) / 2 - 40;
  const startX = 50; // set the x-coordinate of the start point
  const startY = center; // set the y-coordinate of the start point
  const endX = width - 50; // set the x-coordinate of the end point
  const endY = center; // set the y-coordinate of the end point
  const rawPath = `M ${startX} ${startY} L ${endX} ${endY}`;
  const skiaPath = Skia.Path.MakeFromSVGString(rawPath);
  const movableCx = useSharedValue(startX);
  const previousPositionX = useSharedValue(startX);
  const percentComplete = useSharedValue(0);
  const skiaCy = useValue(startY);
  const checker = useRef(true);
  const skValue = useSharedValue(12);
  const circleValue = useSharedValue(0);
  const [mode, setMode] = useState(false);
  ////////////////////////////////////////

  const animatedProps = useAnimatedProps(() => {
    return {
      d: `M${20 - percentComplete.value * 2},${50} Q50,${20 + percentComplete.value * 60} ${
        80 + percentComplete.value * 2
      },${50}`,
    };
  });
  ////////////////////////////////////////
  const gesture = Gesture.Pan()
    .onUpdate(({ translationX }) => {
      const oldCanvasX = translationX + previousPositionX.value;

      // Constrain the x-coordinate to be within the canvas bounds
      const newCanvasX = Math.min(Math.max(startX, oldCanvasX), endX);

      movableCx.value = newCanvasX;

      const percent = (newCanvasX - startX) / (endX - startX);

      if (percent <= 0.5 && checker.current) {
        checker.current = false;
        runOnJS(setMode)(false);
        console.log('sad');
      }
      if (percent >= 0.5 && !checker.current) {
        checker.current = true;
        runOnJS(setMode)(true);
        console.log('happy');
      }
      percentComplete.value = percent;
      skValue.value = interpolate(percentComplete.value, [0, 0.5, 1], [12, 3, 12]);
      console.log(skValue.value);
      circleValue.value = percentComplete.value * 6;
    })
    .onEnd(() => {
      previousPositionX.value = movableCx.value;
    });

  const dotStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(percentComplete.value, [0, 1], [1, 1.6]),
        },
      ],
    };
  });

  const animatedPropsSad = useAnimatedProps(() => {
    return {
      d: `M${30 - percentComplete.value * 10},${50 - percentComplete.value * 10} Q60,${
        50 - percentComplete.value * 40
      } ${90 + percentComplete.value * 10},${20 + percentComplete.value * 20}`,
    };
  });

  const animatedPropsHappy = useAnimatedProps(() => {
    return {
      d: `M${40 - percentComplete.value * 20},${20 + percentComplete.value * 20} Q60,${
        45 - percentComplete.value * 35
      } 100,${50 - percentComplete.value * 10}`,
    };
  });
  const backgroundColorActive = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(percentComplete.value, [0, 1], ['black', 'white']);
    return {
      backgroundColor,
    };
  });
  if (!skiaPath) {
    return <View />;
  }
  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={[styles.container]}>
          <View style={{ flex: 1, backgroundColor: '#161D38' }}>
            <Canvas
              style={{
                width: '100%',
                height: '100%',
              }}>
              <Circle cx={200} cy={200} r={98} style="fill">
                <SweepGradient
                  c={vec(200, 200)}
                  colors={mode ? ['cyan', 'magenta', 'yellow', 'cyan'] : ['gray', 'gray', 'gray', 'gray']}
                />
                <BlurMask blur={skValue} style={'solid'} />
              </Circle>
            </Canvas>
          </View>
          <View style={styles.ghost}>
            <View style={{ width: 180, height: 80, flexDirection: 'row', justifyContent: 'space-around', left: 2 }}>
              <View>
                <Svg width="70" height="70" style={{ top: 10, right: 20 }} viewBox="0 0 180 100">
                  <AnimatedPath
                    animatedProps={animatedPropsSad}
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </Svg>
                <Animated.View style={[styles.dot, dotStyle]} />
              </View>
              <View>
                <Svg width="70" height="70" style={{ top: 10, right: 20 }} viewBox="0 0 180 100">
                  <AnimatedPath
                    animatedProps={animatedPropsHappy}
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                </Svg>
                <Animated.View style={[styles.dot, dotStyle]} />
              </View>
            </View>
            <Svg width="150" height="100" viewBox="0 0 150 100">
              <AnimatedPath
                animatedProps={animatedProps}
                stroke="white"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
          </View>
          <Canvas style={styles.canvas}>
            <Rect x={0} y={0} width={width} height={height} color="#161D38" />
            <Path path={skiaPath} style="stroke" strokeWidth={strokeWidth} strokeCap="round" color={'grey'} />
            <Path
              path={skiaPath}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="round"
              color={'#9ADBA5'}
              start={0}
              end={percentComplete} // update the end value to use percentComplete
            >
              <BlurMask blur={circleValue} style={'solid'} />
            </Path>
            <Circle cx={movableCx} cy={skiaCy} r={20} color="#4DCBF7" style="fill">
              <BlurMask blur={circleValue} style={'solid'} />
            </Circle>
            <Circle cx={movableCx} cy={skiaCy} r={15} color="white" style="fill" />
          </Canvas>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  cursor: {
    backgroundColor: 'green',
  },
  ghost: {
    position: 'absolute',
    top: 100,
    left: 100,
    width: 200,
    height: 200,
    backgroundColor: '#161D38',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    paddingLeft: 54,
  },
  dot: {
    // position: 'absolute',
    // right: 0,
    // top: 0,
    backgroundColor: 'white',
    width: 12,
    height: 12,
    borderRadius: 8,
  },
});
