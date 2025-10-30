import React, {
  Suspense,
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text3D, Center } from '@react-three/drei';
import useWindow from '@webstack/hooks/window/useWindow';

import font_droid_bold from 'three/examples/fonts/droid/droid_sans_bold.typeface.json';
import play_bold from '@webstack/components/Text/jsFonts/play/Play_Bold.json';

interface ThreeDTextProps {
  text: string;
  separateLinesBy?: 'word' | 'line';
  color?: string;
  font?: keyof typeof fontMap;
  size?: number;
  height?: number;
  depth?: number;
  fov?: number;
  lineSpacingPx?: number;
  roughness?: number;
  metalness?: number;
  style?: React.CSSProperties;
}

// Map of available fonts
const fontMap = {
  droid_bold: font_droid_bold,
  play_bold: play_bold,
};

const FitTextLine: React.FC<{
  text: string;
  fontData: any;
  size: number;
  height: number;
  depth: number;
  color: string;
  index: number;
  totalLines: number;
  containerWidth: number;
  containerHeight: number;
  lineSpacingPx: number;
  roughness?: number;
  metalness?: number;
}> = ({
  text,
  fontData,
  size,
  height,
  depth,
  color,
  index,
  totalLines,
  containerWidth,
  containerHeight,
  lineSpacingPx,
  roughness = 0.5,
  metalness = 0.2,
}) => {
  const ref = useRef<any>(null);
  const [scale, setScale] = useState<[number, number, number]>([1, 1, 1]);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  useLayoutEffect(() => {
    if (!ref.current?.geometry) return;

    ref.current.geometry.computeBoundingBox();
    const box = ref.current.geometry.boundingBox;
    if (!box) return;

    const textWidth = box.max.x - box.min.x;
    const textHeight = box.max.y - box.min.y;

    const spacingInUnits = lineSpacingPx / 100;
    const totalSpacing = spacingInUnits * (totalLines - 1);
    const availableHeight = containerHeight * 0.95 - totalSpacing;
    const uniformHeight = availableHeight / totalLines;

    const yOffset =
      (availableHeight + totalSpacing) / 2 -
      (uniformHeight + spacingInUnits) * index -
      uniformHeight / 2;

    const yScale = uniformHeight / textHeight;
    const xScale = (containerWidth * 0.95) / textWidth;

    setScale([xScale, yScale, xScale]);
    setPosition([0, yOffset, 0]);
  }, [
    containerWidth,
    containerHeight,
    index,
    totalLines,
    text,
    lineSpacingPx,
  ]);

  return (
    <group position={position} scale={scale}>
      <Center>
        <Text3D
          ref={(el) => {
            ref.current = el;
          }}
          font={fontData}
          size={size}
          height={depth}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.02}
          bevelSegments={5}
          curveSegments={12}
        >
          {text}
          {/* Use meshStandardMaterial with roughness and metalness */}
          <meshStandardMaterial color={color} 
          // roughness={roughness} metalness={metalness} 
          />
        </Text3D>
      </Center>
    </group>
  );
};

const ThreeDText: React.FC<ThreeDTextProps> = ({
  text,
  separateLinesBy = 'word',
  color = '#ffffff',
  font = 'droid_bold',
  size = 1.5,
  height = 0.3,
  depth = 0.3,
  fov = 70,
  lineSpacingPx = 50,
  roughness = 0.5,
  metalness = 0.2,
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { width } = useWindow();

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [width]);

  const lines =
    separateLinesBy === 'word' ? text.split(' ') : text.split('\n');

  const fontData = fontMap[font] || font_droid_bold;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', height: '100%', ...style }}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <Canvas
          camera={{ position: [0, 0, 5], fov }}
          style={{ width: '100%', height: '100%' }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <Suspense fallback={null}>
            {lines.map((line, i) => (
              <FitTextLine
                key={i}
                index={i}
                totalLines={lines.length}
                text={line}
                fontData={fontData}
                size={size}
                height={height}
                depth={depth}
                color={color}
                containerWidth={dimensions.width / 100}
                containerHeight={dimensions.height / 100}
                lineSpacingPx={lineSpacingPx}
                roughness={roughness}
                metalness={metalness}
              />
            ))}
          </Suspense>
          <OrbitControls enableZoom={false} />
        </Canvas>
      )}
    </div>
  );
};

export default ThreeDText;
