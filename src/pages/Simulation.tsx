import { useMemo, useState } from "react";
import { faceZones, type InjectionPoint } from "../data/faceZones";
import { FaceMap } from "../components/visual/FaceMap";
import { BeforeAfterViewer } from "../components/visual/BeforeAfterViewer";
import { PageHeader } from "../components/ui";
import { useLocale } from "../i18n";
import "../components/visual/visual.css";
import "./Simulation.css";

export function SimulationPage() {
  const { pick, t } = useLocale();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(45);
  const [points, setPoints] = useState<InjectionPoint[]>([]);

  const activeZones = useMemo(
    () => faceZones.filter((z) => selectedZones.includes(z.id)),
    [selectedZones],
  );

  const toggleZone = (id: string) => {
    setSelectedZones((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleUpload = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  const addPoint = (x: number, y: number) => {
    setPoints((prev) => [...prev, { id: crypto.randomUUID(), x, y }]);
  };

  return (
    <div className="simulation-page">
      <PageHeader
        eyebrow={pick(t.appName)}
        title={pick(t.simulation.title)}
        lead={pick(t.simulation.lead)}
      />
      <p className="sim-disclaimer">{pick(t.common.simulationDisclaimer)}</p>

      <div className="sim-layout">
        <aside className="sim-sidebar detail-panel">
          <h2>{pick(t.simulation.zones)}</h2>
          <FaceMap selectedZoneIds={selectedZones} onToggleZone={toggleZone} />

          <div className="sim-controls" style={{ marginTop: "1rem" }}>
            <label className="upload-btn">
              {pick(t.common.uploadPhoto)}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
              />
            </label>

            <label>
              {pick(t.common.intensity)}
              <input
                type="range"
                min={0}
                max={100}
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
              />
            </label>

            <div className="planner-actions">
              <button type="button" className="btn primary" onClick={() => addPoint(0.5, 0.5)}>
                {pick(t.common.addPoint)}
              </button>
              <button type="button" className="btn ghost" onClick={() => setPoints([])}>
                {pick(t.common.clearPoints)}
              </button>
            </div>
          </div>
        </aside>

        <section className="sim-preview detail-panel">
          <h2>{pick(t.simulation.compare)}</h2>
          <BeforeAfterViewer
            imageUrl={imageUrl}
            activeZones={activeZones}
            intensity={intensity}
            points={points}
            onAddPoint={addPoint}
            mode="split"
          />
          <p className="sim-note">{pick(t.common.disclaimer)}</p>
        </section>
      </div>
    </div>
  );
}
