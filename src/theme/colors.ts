export const colors = {
  background: "#F6F3EE",
  backgroundRaised: "#FBFAF7",
  surface: "#FFFFFF",
  surfaceElevated: "#F0ECE6",
  surfaceSoft: "#E8E2D9",
  glass: "rgba(255, 255, 255, 0.82)",
  glassStrong: "rgba(255, 255, 255, 0.96)",
  border: "#E6E0D8",
  borderStrong: "#D1C7BA",
  ink: "#1B1A18",
  inkSoft: "#383531",
  muted: "#77726B",
  mutedStrong: "#5B5650",
  accent: "#6B5CA5",
  accentStrong: "#504389",
  accentSoft: "#8A7EBD",
  iris: "#6B5CA5",
  pearl: "#EFDCD4",
  sage: "#628A75",
  sageSoft: "#DCEDE3",
  warn: "#B9822E",
  danger: "#B84F4F",
  dangerSoft: "#F5D7D7",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const shadows = {
  soft: {
    shadowColor: "#382F24",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  glow: {
    shadowColor: "#6B5CA5",
    shadowOpacity: 0.12,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
} as const;

export const radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 22,
  xl: 30,
  pill: 999,
} as const;
