import { Image, StyleSheet, View } from "react-native";

import { GHOST_OVERLAY_OPACITY } from "@/features/camera/types";

interface GhostImageOverlayProps {
  uri: string;
  visible: boolean;
}

export function GhostImageOverlay({ uri, visible }: GhostImageOverlayProps) {
  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={{ uri }}
        style={[StyleSheet.absoluteFill, styles.ghost]}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  ghost: {
    opacity: GHOST_OVERLAY_OPACITY,
  },
});
