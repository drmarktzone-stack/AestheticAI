import { useEffect, useState } from "react";
import { STITCH } from "../../lib/assets";
import "./timeline.css";

interface TimelineScrubberProps {
  autoPlay?: boolean;
}

export function TimelineScrubber({ autoPlay = false }: TimelineScrubberProps) {
  const frames = STITCH.timeline;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, 1600);
    return () => window.clearInterval(id);
  }, [playing, frames.length]);

  const current = frames[index];

  return (
    <div className="timeline">
      <div className="timeline-stage">
        {frames.map((f, i) => (
          <img
            key={f.id}
            src={f.src}
            alt={f.label}
            className={`timeline-frame ${i === index ? "active" : ""}`}
          />
        ))}
        <div className="timeline-caption">
          <strong>{current.label}</strong>
          <span>{current.sub}</span>
        </div>
      </div>

      <div className="timeline-controls">
        <button type="button" className="btn ghost" onClick={() => setPlaying((p) => !p)}>
          {playing ? "השהה" : "הפעל טיימליין"}
        </button>
        <div className="timeline-dots" role="tablist" aria-label="שלבי החלמה">
          {frames.map((f, i) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={i === index ? "active" : ""}
              onClick={() => {
                setPlaying(false);
                setIndex(i);
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <input
          type="range"
          min={0}
          max={frames.length - 1}
          value={index}
          aria-label="סרגל טיימליין"
          onChange={(e) => {
            setPlaying(false);
            setIndex(Number(e.target.value));
          }}
        />
      </div>
    </div>
  );
}
