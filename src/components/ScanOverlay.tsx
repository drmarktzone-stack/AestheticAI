import { regionPoly, SIM_REGIONS } from "../lib/face/regions";
import type { SimRegionId, Vec2 } from "../lib/face/types";
import { findingPath, type InjectionMark } from "../lib/clinicalScan";
import type { ScanFinding } from "../lib/scanTypes";

type Props = {
  landmarks: Vec2[];
  findings: ScanFinding[];
  mode: "scan" | "inject";
  selected?: SimRegionId | null;
  marks?: InjectionMark[];
  onSelectRegion?: (id: SimRegionId) => void;
};

function toPoints(points: Vec2[]): string {
  return points.map((p) => `${p.x * 100},${p.y * 100}`).join(" ");
}

export function ScanOverlay({ landmarks, findings, mode, selected, marks = [], onSelectRegion }: Props) {
  const enabled = findings.filter((item) => item.enabled);

  return (
    <svg className="sim-marks" viewBox="0 0 100 100" preserveAspectRatio="none">
      {mode === "scan"
        ? enabled.map((finding) => {
            const path = findingPath(finding, landmarks);
            if (path.length < 2) return null;
            const pts = toPoints(path);
            if (finding.kind === "wrinkle") {
              return <polyline key={finding.id} className="scan-line" points={pts} />;
            }
            if (finding.kind === "fold") {
              return <polyline key={finding.id} className="scan-fold" points={pts} />;
            }
            return (
              <polygon
                key={finding.id}
                className={finding.kind === "hypertrophy" ? "scan-hyper" : "scan-volume"}
                points={pts}
              />
            );
          })
        : null}

      {mode === "inject"
        ? marks.map((mark, index) => (
            <g key={`${mark.treatmentId}-${index}`} className="inject-mark">
              <circle className="inject-dot" cx={mark.x * 100} cy={mark.y * 100} r="1.15" />
              {mark.label ? (
                <>
                  <rect
                    className="inject-chip-bg"
                    x={mark.x * 100 + 1.4}
                    y={mark.y * 100 - 1.7}
                    width={Math.max(8, mark.label.length * 1.55)}
                    height="3.2"
                    rx="0.7"
                  />
                  <text className="inject-chip" direction="ltr" x={mark.x * 100 + 1.9} y={mark.y * 100 + 0.55}>
                    {mark.label}
                  </text>
                </>
              ) : null}
            </g>
          ))
        : null}

      {mode === "scan"
        ? SIM_REGIONS.map((def) => {
            const poly = regionPoly(landmarks, def);
            if (!poly.length) return null;
            const c = {
              x: poly.reduce((s, p) => s + p.x, 0) / poly.length,
              y: poly.reduce((s, p) => s + p.y, 0) / poly.length,
            };
            return (
              <g
                key={def.id}
                className={selected === def.id ? "on" : undefined}
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectRegion?.(def.id);
                }}
              >
                <circle cx={c.x * 100} cy={c.y * 100} r={selected === def.id ? 1.7 : 0.95} />
              </g>
            );
          })
        : null}
    </svg>
  );
}
