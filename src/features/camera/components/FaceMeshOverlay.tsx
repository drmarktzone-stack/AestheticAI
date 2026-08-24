import { memo, useMemo } from "react";
import { StyleSheet, View, type LayoutRectangle } from "react-native";
import Svg, { Circle, Line, Polygon } from "react-native-svg";

import {
  FACE_MESH_EDGES,
  FACE_MESH_LANDMARKS,
  FACE_OVAL_LANDMARKS,
  landmarkById,
  toSvgPoint,
} from "@/features/camera/landmarks/faceMesh";
import type { AlignmentMetrics } from "@/features/camera/types";

interface FaceMeshOverlayProps {
  layout: LayoutRectangle | null;
  alignment: AlignmentMetrics;
}

function meshColor(alignment: AlignmentMetrics): string {
  if (alignment.isAligned) return "rgba(159, 227, 219, 0.95)";
  if (alignment.score >= 60) return "rgba(196, 149, 74, 0.9)";
  return "rgba(240, 180, 180, 0.9)";
}

function FaceMeshOverlayComponent({ layout, alignment }: FaceMeshOverlayProps) {
  const color = meshColor(alignment);

  const geometry = useMemo(() => {
    if (!layout) return null;
    const { width, height } = layout;

    const ovalPoints = FACE_OVAL_LANDMARKS.map((l) => toSvgPoint(l, width, height))
      .map((p) => `${p.x},${p.y}`)
      .join(" ");

    const edges = FACE_MESH_EDGES.map(([a, b]) => {
      const la = landmarkById(a);
      const lb = landmarkById(b);
      if (!la || !lb) return null;
      const pa = toSvgPoint(la, width, height);
      const pb = toSvgPoint(lb, width, height);
      return { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y, key: `${a}-${b}` };
    }).filter(Boolean) as Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      key: string;
    }>;

    const nodes = FACE_MESH_LANDMARKS.map((l) => ({
      ...toSvgPoint(l, width, height),
      id: l.id,
    }));

    return { width, height, ovalPoints, edges, nodes };
  }, [layout]);

  if (!geometry) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={geometry.width} height={geometry.height}>
        <Polygon
          points={geometry.ovalPoints}
          fill="rgba(46, 139, 138, 0.06)"
          stroke={color}
          strokeWidth={1.5}
        />
        {geometry.edges.map((e) => (
          <Line
            key={e.key}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={color}
            strokeWidth={1}
            strokeOpacity={0.75}
          />
        ))}
        {geometry.nodes.map((n) => (
          <Circle key={n.id} cx={n.x} cy={n.y} r={2.2} fill={color} />
        ))}
      </Svg>
    </View>
  );
}

export const FaceMeshOverlay = memo(FaceMeshOverlayComponent);
