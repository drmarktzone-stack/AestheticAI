import { useEffect, useState } from "react";
import { techniquePaths } from "../../data/faceZones";
import { getTechnique } from "../../data";
import { useLocale } from "../../i18n";
import "./visual.css";

export function TechniqueSimulator({ techniqueId }: { techniqueId: string }) {
  const { locale } = useLocale();
  const path = techniquePaths.find((p) => p.techniqueId === techniqueId) ?? techniquePaths[0]!;
  const technique = getTechnique(techniqueId);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const id = window.setInterval(() => {
      frame = (frame + 2) % 102;
      setProgress(frame > 100 ? 0 : frame);
    }, 40);
    return () => window.clearInterval(id);
  }, [techniqueId]);

  const name =
    locale === "he"
      ? technique?.nameHe
      : locale === "ar"
        ? technique?.nameAr ?? technique?.nameHe
        : technique?.nameEn;

  return (
    <div className="technique-sim">
      <svg viewBox="0 0 100 100" className="technique-svg">
        <ellipse cx="50" cy="52" rx="32" ry="40" className="face-outline" />
        <path d={path.path} className="technique-path" pathLength={100} strokeDasharray={`${progress} 100`} />
        <circle cx={path.start.x} cy={path.start.y} r="2.5" className="needle-start" />
        <circle
          cx={path.start.x + (path.end.x - path.start.x) * (progress / 100)}
          cy={path.start.y + (path.end.y - path.start.y) * (progress / 100)}
          r="2"
          className="needle-tip"
        />
      </svg>
      <p className="technique-caption">{name}</p>
    </div>
  );
}
