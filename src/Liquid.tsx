import { Blur, Canvas, Circle, ColorMatrix, Group, Paint, Rect, SweepGradient, vec } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { StatusBar, useWindowDimensions } from 'react-native';
import { Easing, useDerivedValue, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const RADIUS = 50;
const dropSize = 80;
// withTiming(500, {
//   duration: 2000,
//   easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
// }); // going up
export function Liquid() {
  const { width: windowWidth } = useWindowDimensions();
  const statusBar = -(StatusBar.currentHeight || 40);
  const movableCx = useSharedValue(windowWidth / 2 - dropSize / 2);
  const movableCy = useSharedValue(statusBar - dropSize / 2);
  const width = useSharedValue(dropSize);
  const height = useSharedValue(dropSize);

  useEffect(() => {
    movableCy.value = withTiming(60, { duration: 700 });
    movableCx.value = withDelay(500, withTiming(windowWidth / 3 - dropSize / 2, { duration: 500 }));
    width.value = withDelay(500, withTiming(windowWidth / 2, { duration: 500 }));
    height.value = withDelay(500, withTiming(50, { duration: 500 }));
    setTimeout(() => {
      //write reverse
      movableCx.value = withTiming(windowWidth / 2 - dropSize / 2, { duration: 500 });
      width.value = withTiming(dropSize, { duration: 500 });
      movableCy.value = withDelay(500, withTiming(statusBar - dropSize / 2, { duration: 500 }));
      height.value = withDelay(200, withTiming(dropSize, { duration: 500 }));
    }, 3000);
  }, []);

  const rect = useDerivedValue(() => {
    return {
      x: movableCx.value,
      y: movableCy.value,
      width: width.value,
      height: height.value,
    };
  });
  // const rOuterView = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateX: -Math.max(transX.value, 1) / 2 }],
  //   };
  // }, []);

  // const rInnerView = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateX: transX.value }],
  //   };
  // }, []);
  const layer = useMemo(() => {
    return (
      <Paint>
        {/* pixelOpacity > blurredOpacity * 60 - 30 */}
        <Blur blur={24} />
        <ColorMatrix
          matrix={[
            // R, G, B, A, Bias (Offset)
            // prettier-ignore
            1, 0, 0, 0, 0,
            // prettier-ignore
            0, 1, 0, 0, 0,
            // prettier-ignore
            0, 0, 1, 0, 0,
            // prettier-ignore
            0, 0, 0, 50, -24,
          ]}
        />
      </Paint>
    );
  }, []);

  return (
    <>
      <StatusBar barStyle={'light-content'} />
      <Canvas
        style={{
          flex: 1,
          backgroundColor: 'black',
        }}>
        <Group layer={layer}>
          <Rect rect={rect} color="#8556E5" style={'fill'} strokeCap={'round'} strokeJoin={'round'} />
          <Circle cx={windowWidth / 2} cy={statusBar} r={RADIUS} color={'black'} />
          <SweepGradient c={vec(0, 0)} colors={['cyan', 'magenta', 'cyan']} />
        </Group>
      </Canvas>
    </>
  );
}
