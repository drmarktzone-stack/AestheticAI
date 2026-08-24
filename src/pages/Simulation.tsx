import { useMemo, useState } from "react";
import { faceZones, type InjectionPoint } from "../data/faceZones";
import { FaceMap } from "../components/visual/FaceMap";
import { BeforeAfterViewer } from "../components/visual/BeforeAfterViewer";
import { TimelineScrubber } from "../components/visual/TimelineScrubber";
import { AnimationReel } from "../components/visual/AnimationReel";
import { ClinicalVideo, ClinicalVideoGrid } from "../components/visual/ClinicalVideo";
import { DRIVE_VIDEOS, featuredLipsVideos } from "../lib/driveMedia";
import { STITCH } from "../lib/assets";
import { useLocale } from "../i18n";
import "../components/visual/visual.css";
import "./Simulation.css";

const MATERIALS = [
  { id: "voluma", name: "Voluma HA", meta: "20mg/ml" },
  { id: "lyft", name: "Restylane Lyft", meta: "20mg/ml, Firm" },
  { id: "sculptra", name: "Sculptra", meta: "PLLA Biostimulator" },
];

const DEPTHS = [
  "Superficial Dermis",
  "Mid Dermis",
  "Deep Dermis",
  "Subcutaneous",
  "Supraperiosteal",
];

const ZONES = [
  { id: "ck1", name: "Zygomatic Arch (CK1)", dose: "0.1ml", depth: "Supraperiosteal", active: true },
  { id: "nl1", name: "Nasolabial Fold (NL1)", dose: "—", depth: "Pending", active: false },
  { id: "jw1", name: "Jawline (JW1)", dose: "—", depth: "Pending", active: false },
];

type ViewMode = "videos" | "canvas" | "compare" | "timeline" | "animation";

export function SimulationPage() {
  const { pick, t } = useLocale();
  const [materialId, setMaterialId] = useState(MATERIALS[0].id);
  const [depth, setDepth] = useState(5);
  const [volume, setVolume] = useState(0.1);
  const [selectedZones, setSelectedZones] = useState<string[]>(["cheek-l", "cheek-r"]);
  const [intensity, setIntensity] = useState(45);
  const [points, setPoints] = useState<InjectionPoint[]>([]);
  const [mode, setMode] = useState<ViewMode>("videos");
  const [imageUrl, setImageUrl] = useState<string | null>(STITCH.profile);

  const activeZones = useMemo(
    () => faceZones.filter((z) => selectedZones.includes(z.id)),
    [selectedZones],
  );

  const toggleZone = (id: string) => {
    setSelectedZones((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleUpload = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl((old) => {
      if (old && old.startsWith("blob:")) URL.revokeObjectURL(old);
      return url;
    });
    setMode("compare");
  };

  const addPoint = (x: number, y: number) => {
    setPoints((prev) => [...prev, { id: crypto.randomUUID(), x, y }]);
  };

  const totalVolume = (volume * Math.max(points.length, 1)).toFixed(1);

  return (
    <div className="sim-workspace">
      <aside className="sim-rail sim-rail-start">
        <div className="sim-rail-head">
          <h1>סימולציה</h1>
          <p>מטופלת א׳ — פרוטוקול נפח ושחזור</p>
        </div>

        <section className="sim-block">
          <h2>חומרים פעילים</h2>
          <div className="sim-materials">
            {MATERIALS.map((m) => (
              <label key={m.id} className={materialId === m.id ? "active" : ""}>
                <input
                  type="radio"
                  name="material"
                  checked={materialId === m.id}
                  onChange={() => setMaterialId(m.id)}
                />
                <span>
                  <strong>{m.name}</strong>
                  <em>{m.meta}</em>
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="sim-block">
          <h2>פרמטרי הזרקה</h2>
          <label className="sim-slider">
            <span>
              עומק
              <b>{DEPTHS[depth - 1]}</b>
            </span>
            <input
              type="range"
              min={1}
              max={5}
              value={depth}
              onChange={(e) => setDepth(Number(e.target.value))}
            />
          </label>
          <label className="sim-slider">
            <span>
              נפח לנקודה (מ״ל)
              <b>{volume.toFixed(2)}</b>
            </span>
            <input
              type="range"
              min={0.05}
              max={0.5}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </label>
          <label className="sim-slider">
            <span>
              {pick(t.common.intensity)}
              <b>{intensity}%</b>
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
            />
          </label>
        </section>

        <section className="sim-block">
          <h2>{pick(t.simulation.zones)}</h2>
          <FaceMap selectedZoneIds={selectedZones} onToggleZone={toggleZone} />
        </section>

        <div className="sim-rail-actions">
          <label className="btn ghost upload">
            {pick(t.common.uploadPhoto)}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
            />
          </label>
          <button type="button" className="btn primary">
            שמור פרוטוקול
          </button>
        </div>
      </aside>

      <section className="sim-canvas">
        <div className="sim-mode-tabs" role="tablist">
          {(
            [
              ["videos", "סרטוני הזרקה"],
              ["timeline", "טיימליין החלמה"],
              ["animation", "אנימציית Flow"],
              ["compare", "לפני / אחרי"],
              ["canvas", "מיפוי הזרקה"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              className={mode === id ? "active" : ""}
              onClick={() => setMode(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sim-stage">
          {mode === "videos" && (
            <div className="sim-videos">
              <ClinicalVideo video={featuredLipsVideos()[0]} autoPlay />
              <ClinicalVideoGrid videos={DRIVE_VIDEOS} />
            </div>
          )}
          {mode === "timeline" && <TimelineScrubber autoPlay />}
          {mode === "animation" && <AnimationReel />}
          {mode === "compare" && (
            <BeforeAfterViewer
              imageUrl={imageUrl}
              activeZones={activeZones}
              intensity={intensity}
              points={points}
              onAddPoint={addPoint}
              mode="split"
            />
          )}
          {mode === "canvas" && (
            <div className="sim-face-stage">
              <img src={STITCH.profile} alt="" className="sim-face-bg" />
              <BeforeAfterViewer
                imageUrl={imageUrl}
                activeZones={activeZones}
                intensity={intensity}
                points={points}
                onAddPoint={addPoint}
                mode="after"
              />
            </div>
          )}
        </div>

        <div className="sim-status">
          <span>
            סה״כ נפח מתוכנן: <strong>{totalVolume} מ״ל</strong>
          </span>
          <span>{pick(t.common.simulationDisclaimer)}</span>
        </div>
      </section>

      <aside className="sim-rail sim-rail-end">
        <div className="sim-rail-head">
          <h2>אזורי טיפול</h2>
          <p>Midface · Volume restore</p>
        </div>
        <ul className="sim-zone-list">
          {ZONES.map((z) => (
            <li key={z.id} className={z.active ? "active" : ""}>
              <span className="sim-zone-num">{z.id.slice(-1)}</span>
              <div>
                <strong>{z.name}</strong>
                <em>
                  {z.dose} · {z.depth}
                </em>
              </div>
            </li>
          ))}
        </ul>
        <div className="sim-ba-thumb">
          <img src={STITCH.beforeAfter} alt="לפני ואחרי" />
          <p>השוואת לפני / אחרי — פרוטוקול נפח</p>
        </div>
      </aside>
    </div>
  );
}
