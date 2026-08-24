import Svg, { Circle, Path, Polyline, Rect } from "react-native-svg";

export type AppIconName =
  | "home"
  | "spark"
  | "heart"
  | "camera"
  | "arrowRight"
  | "arrowLeft"
  | "chevronRight"
  | "chevronLeft"
  | "shield"
  | "play"
  | "check"
  | "alert"
  | "chart"
  | "calendar"
  | "info"
  | "scan";

interface AppIconProps {
  name: AppIconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function AppIcon({ name, size = 22, color = "#FCFAFF", strokeWidth = 1.8 }: AppIconProps) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  const paths: Record<AppIconName, React.ReactNode> = {
    home: <Path {...common} d="M3 10.7 12 3l9 7.7v9.6a.7.7 0 0 1-.7.7H3.7a.7.7 0 0 1-.7-.7zM9 21v-6h6v6" />,
    spark: <Path {...common} d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6zM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7z" />,
    heart: <Path {...common} d="M20.8 8.2c0 5.6-8.8 11.6-8.8 11.6s-8.8-6-8.8-11.6A4.8 4.8 0 0 1 12 5a4.8 4.8 0 0 1 8.8 3.2Z" />,
    camera: <><Path {...common} d="M4.4 7.5h3l1.5-2.1h6.2l1.5 2.1h3a1.9 1.9 0 0 1 1.9 1.9v9.2a1.9 1.9 0 0 1-1.9 1.9H4.4a1.9 1.9 0 0 1-1.9-1.9V9.4a1.9 1.9 0 0 1 1.9-1.9Z" /><Circle {...common} cx="12" cy="14" r="3.6" /></>,
    arrowRight: <Path {...common} d="M5 12h14M13 6l6 6-6 6" />,
    arrowLeft: <Path {...common} d="M19 12H5m6 6-6-6 6-6" />,
    chevronRight: <Path {...common} d="m9 18 6-6-6-6" />,
    chevronLeft: <Path {...common} d="m15 18-6-6 6-6" />,
    shield: <Path {...common} d="M12 3 20 6v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6zM9.2 12l1.8 1.8 3.8-4" />,
    play: <Path {...common} d="m9 7 7 5-7 5z" />,
    check: <Path {...common} d="m5 12 4.2 4.2L19 6.8" />,
    alert: <><Path {...common} d="M10.2 4.2 2.9 17a2 2 0 0 0 1.8 3h14.6a2 2 0 0 0 1.8-3L13.8 4.2a2 2 0 0 0-3.6 0Z" /><Path {...common} d="M12 9v4M12 16.5v.1" /></>,
    chart: <><Path {...common} d="M4 19V5M4 19h16" /><Path {...common} d="m7 15 3-3 3 1.8 4-5.3" /></>,
    calendar: <><Rect {...common} x="3.5" y="5" width="17" height="15.5" rx="2" /><Path {...common} d="M7.5 3v4M16.5 3v4M3.5 10h17" /><Circle fill={color} cx="8" cy="14" r=".75" /><Circle fill={color} cx="12" cy="14" r=".75" /><Circle fill={color} cx="16" cy="14" r=".75" /></>,
    info: <><Circle {...common} cx="12" cy="12" r="9" /><Path {...common} d="M12 10.8v5M12 7.8v.1" /></>,
    scan: <><Path {...common} d="M7 3H4a1 1 0 0 0-1 1v3M17 3h3a1 1 0 0 1 1 1v3M21 17v3a1 1 0 0 1-1 1h-3M7 21H4a1 1 0 0 1-1-1v-3" /><Polyline {...common} points="8,13 10.5,15.5 16,10" /></>,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name]}
    </Svg>
  );
}
