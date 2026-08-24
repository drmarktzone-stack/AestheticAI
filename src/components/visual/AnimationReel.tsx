import { useEffect, useState } from "react";
import { STITCH } from "../../lib/assets";
import "./animation-reel.css";

export function AnimationReel({ intervalMs = 900 }: { intervalMs?: number }) {
  const frames = STITCH.animation;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [frames.length, intervalMs]);

  return (
    <div className="anim-reel" aria-label="סימולציית אנימציה קלינית">
      {frames.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={i === index ? "active" : ""}
        />
      ))}
      <div className="anim-reel-badge">Flow · סימולציה רפואית</div>
    </div>
  );
}
