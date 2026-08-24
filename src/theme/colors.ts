export const colors = {
  background: "#08091A",
  backgroundRaised: "#101126",
  surface: "#17182D",
  surfaceElevated: "#20213B",
  surfaceSoft: "#2A2A48",
  glass: "rgba(31, 31, 55, 0.78)",
  glassStrong: "rgba(39, 39, 68, 0.92)",
  border: "rgba(238, 234, 255, 0.13)",
  borderStrong: "rgba(218, 201, 255, 0.28)",
  ink: "#FCFAFF",
  inkSoft: "#E5E0F1",
  muted: "#A8A3BA",
  mutedStrong: "#C9C2D8",
  accent: "#BCA2F6",
  accentStrong: "#8F6DDF",
  accentSoft: "#D8CBFF",
  iris: "#7D66CD",
  pearl: "#F6EDE6",
  sage: "#8BD4BB",
  sageSoft: "#C8F2E2",
  warn: "#F4BD6C",
  danger: "#FF8A94",
  dangerSoft: "#FFC2C8",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const shadows = {
  soft: {
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  glow: {
    shadowColor: "#BCA2F6",
    shadowOpacity: 0.17,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;

export const radius = {
  xs: 10,
  sm: 14,
  md: 18,
  lg: 24,
  xl: 32,
  pill: 999,
} as const;
