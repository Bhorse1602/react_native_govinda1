import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Filter, FeGaussianBlur, FeMerge, FeMergeNode } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type Point = { x: number; y: number };

export interface AnimatedPathProps {
  /** Array of points to connect, each point is {x, y} in pixels relative to SVG container */
  points: Point[];
  /** Stroke color (default golden) */
  strokeColor?: string;
  /** Stroke width (default 4) */
  strokeWidth?: number;
  /** Duration of drawing animation per segment in milliseconds (default 300) */
  segmentDuration?: number;
  /** Delay between segments in milliseconds (default 150) */
  segmentDelay?: number;
  /** Whether to enable curved lines (quadratic bezier) */
  curved?: boolean;
  /** Curve intensity (0 = straight, 1 = maximum curve) default 0.3 */
  curveIntensity?: number;
  /** Whether to show glow effect */
  glow?: boolean;
  /** Callback when animation completes */
  onAnimationComplete?: () => void;
  /** Start animation automatically when mounted */
  autoPlay?: boolean;
  /** Reset animation when points change */
  resetOnPointsChange?: boolean;
}

/**
 * A smooth, elegant animated path drawing component with bezier curves and glow effects.
 * Uses react-native-svg and react-native-reanimated for performance.
 */
export default function AnimatedPathComponent({
  points,
  strokeColor = '#FFD700',
  strokeWidth = 4,
  segmentDuration = 300,
  segmentDelay = 150,
  curved = true,
  curveIntensity = 0.3,
  glow = true,
  onAnimationComplete,
  autoPlay = true,
  resetOnPointsChange = true,
}: AnimatedPathProps) {
  const progress = useSharedValue(0);
  const totalSegments = points.length - 1;

  // Build SVG path string
  const pathString = React.useMemo(() => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      if (curved && i < points.length - 1) {
        const next = points[i + 1];
        // create a quadratic bezier control point midway between current and next, with some curvature
        const cp = {
          x: (curr.x + next.x) / 2,
          y: (curr.y + next.y) / 2 - (Math.abs(next.x - curr.x) * curveIntensity),
        };
        d += ` Q ${cp.x} ${cp.y} ${curr.x} ${curr.y}`;
      } else {
        d += ` L ${curr.x} ${curr.y}`;
      }
    }
    return d;
  }, [points, curved, curveIntensity]);

  // Calculate total length of path (approximation)
  const totalLength = React.useMemo(() => {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
      const dx = points[i].x - points[i - 1].x;
      const dy = points[i].y - points[i - 1].y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  }, [points]);

  // Animated props for dash offset
  const animatedProps = useAnimatedProps(() => {
    const dashoffset = totalLength * (1 - progress.value);
    return {
      strokeDashoffset: dashoffset,
    };
  });

  // Start animation
  const startAnimation = React.useCallback(() => {
    progress.value = 0;
    progress.value = withTiming(
      1,
      {
        duration: segmentDuration * totalSegments + segmentDelay * Math.max(0, totalSegments - 1),
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      }
    );
  }, [progress, segmentDuration, segmentDelay, totalSegments, onAnimationComplete]);

  // Auto-play on mount
  useEffect(() => {
    if (autoPlay) {
      startAnimation();
    }
  }, [autoPlay, startAnimation]);

  // Reset when points change
  useEffect(() => {
    if (resetOnPointsChange) {
      progress.value = 0;
      if (autoPlay) {
        startAnimation();
      }
    }
  }, [points, resetOnPointsChange, autoPlay, progress, startAnimation]);

  // Manual control functions
  const play = () => startAnimation();
  const reset = () => {
    progress.value = 0;
  };

  // Expose via ref if needed (optional)

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
      <Svg width="100%" height="100%">
        <Defs>
          {/* Glow filter */}
          {glow && (
            <Filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <FeGaussianBlur stdDeviation="3" result="blur" />
              <FeMerge>
                <FeMergeNode in="blur" />
                <FeMergeNode in="SourceGraphic" />
              </FeMerge>
            </Filter>
          )}
          {/* Golden gradient */}
          <LinearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#FFD700" stopOpacity="1" />
            <Stop offset="100%" stopColor="#FFCC00" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Glow path (behind) */}
        {glow && (
          <Path
            d={pathString}
            stroke="url(#goldGradient)"
            strokeWidth={strokeWidth + 6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.4}
            filter="url(#glow)"
          />
        )}

        {/* Main animated path */}
        <AnimatedPath
          animatedProps={animatedProps}
          d={pathString}
          stroke="url(#goldGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength}
        />
      </Svg>
    </View>
  );
}