import { useCallback, useEffect, useRef, useState } from "react";
import type { FaceZone, InjectionPoint } from "../../data/faceZones";
import { drawInjectionPoints, renderSimulatedImage } from "../../lib/simulation";
import { useLocale } from "../../i18n";
import "./visual.css";

interface BeforeAfterViewerProps {
  imageUrl: string | null;
  activeZones: FaceZone[];
  intensity: number;
  points: InjectionPoint[];
  onAddPoint: (x: number, y: number) => void;
  mode: "before" | "after" | "split";
}

export function BeforeAfterViewer({
  imageUrl,
  activeZones,
  intensity,
  points,
  onAddPoint,
  mode,
}: BeforeAfterViewerProps) {
  const { pick, t } = useLocale();
  const beforeRef = useRef<HTMLCanvasElement>(null);
  const afterRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  const paint = useCallback(() => {
    const img = imgRef.current;
    const before = beforeRef.current;
    const after = afterRef.current;
    if (!img || !before || !after || !loaded) return;

    const simulated = renderSimulatedImage(img, activeZones, intensity);
    const w = simulated.width;
    const h = simulated.height;
    before.width = w;
    before.height = h;
    after.width = w;
    after.height = h;

    const bctx = before.getContext("2d")!;
    const actx = after.getContext("2d")!;
    bctx.drawImage(img, 0, 0, w, h);
    actx.drawImage(simulated, 0, 0);
    drawInjectionPoints(bctx, w, h, points);
    drawInjectionPoints(actx, w, h, points);
  }, [activeZones, intensity, points, loaded]);

  useEffect(() => {
    if (!imageUrl) {
      setLoaded(false);
      return;
    }
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    paint();
  }, [paint]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    onAddPoint((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
  };

  if (!imageUrl) {
    return <div className="canvas-placeholder">{pick(t.common.uploadPhoto)}</div>;
  }

  if (mode === "split") {
    return (
      <div className="split-view">
        <figure>
          <figcaption>{pick(t.common.before)}</figcaption>
          <canvas ref={beforeRef} onClick={handleClick} className="patient-canvas" />
        </figure>
        <figure>
          <figcaption>{pick(t.common.after)}</figcaption>
          <canvas ref={afterRef} className="patient-canvas" />
        </figure>
      </div>
    );
  }

  const singleRef = mode === "before" ? beforeRef : afterRef;
  return <canvas ref={singleRef} onClick={handleClick} className="patient-canvas single" />;
}
