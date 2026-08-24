import { useMemo, useState } from "react";
import { materials, regions, techniques } from "../data";
import { faceZones, type InjectionPoint } from "../data/faceZones";
import { FaceMap } from "../components/visual/FaceMap";
import { BeforeAfterViewer } from "../components/visual/BeforeAfterViewer";
import { TechniqueSimulator } from "../components/visual/TechniqueSimulator";
import { PageHeader } from "../components/ui";
import { useLocale } from "../i18n";
import { entityName } from "../lib/entityName";
import "../components/visual/visual.css";
import "./Consultation.css";

const STEPS = ["assess", "plan", "simulate", "document"] as const;

export function ConsultationPage() {
  const { pick, t, locale } = useLocale();
  const [step, setStep] = useState(0);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [regionId, setRegionId] = useState(regions[0]?.id ?? "");
  const [materialId, setMaterialId] = useState(materials[0]?.id ?? "");
  const [techniqueId, setTechniqueId] = useState(techniques[0]?.id ?? "");
  const [dose, setDose] = useState("");
  const [notes, setNotes] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(40);
  const [points, setPoints] = useState<InjectionPoint[]>([]);

  const stepLabels = [
    pick(t.consultation.stepAssess),
    pick(t.consultation.stepPlan),
    pick(t.consultation.stepSimulate),
    pick(t.consultation.stepDocument),
  ];

  const activeZones = useMemo(
    () => faceZones.filter((z) => selectedZones.includes(z.id)),
    [selectedZones],
  );

  const summary = useMemo(() => {
    const region = regions.find((r) => r.id === regionId);
    const material = materials.find((m) => m.id === materialId);
    const technique = techniques.find((x) => x.id === techniqueId);
    return {
      region: region ? entityName(region, locale) : regionId,
      material: material ? entityName(material, locale) : materialId,
      technique: technique ? entityName(technique, locale) : techniqueId,
      dose,
      notes,
      zones: selectedZones.length,
      points: points.length,
    };
  }, [regionId, materialId, techniqueId, dose, notes, selectedZones, points, locale]);

  const exportText = () => {
    const text = [
      `Protokol — ${pick(t.consultation.title)}`,
      `${pick(t.consultation.stepAssess)}: ${summary.region}`,
      `${pick(t.nav.materials)}: ${summary.material}`,
      `${pick(t.nav.techniques)}: ${summary.technique}`,
      `Dose: ${summary.dose || "—"}`,
      `Zones: ${summary.zones}, Points: ${summary.points}`,
      `Notes: ${summary.notes || "—"}`,
      pick(t.common.disclaimer),
    ].join("\n");
    navigator.clipboard.writeText(text);
  };

  const toggleZone = (id: string) => {
    setSelectedZones((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div>
      <PageHeader title={pick(t.consultation.title)} lead={pick(t.consultation.lead)} />

      <div className="consult-steps">
        {STEPS.map((_, i) => (
          <span key={STEPS[i]} className={`consult-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
            {i + 1}. {stepLabels[i]}
          </span>
        ))}
      </div>

      {step === 0 && (
        <section className="detail-panel">
          <h2>{pick(t.consultation.stepAssess)}</h2>
          <FaceMap selectedZoneIds={selectedZones} onToggleZone={toggleZone} />
          <label style={{ display: "grid", gap: "0.35rem", marginTop: "1rem" }}>
            {pick(t.common.selectRegion)}
            <select value={regionId} onChange={(e) => setRegionId(e.target.value)}>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {entityName(r, locale)}
                </option>
              ))}
            </select>
          </label>
        </section>
      )}

      {step === 1 && (
        <section className="detail-panel">
          <h2>{pick(t.consultation.stepPlan)}</h2>
          <div className="consult-form">
            <label>
              {pick(t.nav.materials)}
              <select value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {entityName(m, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {pick(t.nav.techniques)}
              <select value={techniqueId} onChange={(e) => setTechniqueId(e.target.value)}>
                {techniques.map((x) => (
                  <option key={x.id} value={x.id}>
                    {entityName(x, locale)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Dose / Volume
              <input value={dose} onChange={(e) => setDose(e.target.value)} placeholder="IFU" />
            </label>
          </div>
          <TechniqueSimulator techniqueId={techniqueId} />
        </section>
      )}

      {step === 2 && (
        <section className="detail-panel">
          <h2>{pick(t.consultation.stepSimulate)}</h2>
          <label className="upload-btn">
            {pick(t.common.uploadPhoto)}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageUrl(URL.createObjectURL(file));
              }}
            />
          </label>
          <label style={{ display: "grid", gap: "0.35rem", margin: "1rem 0" }}>
            {pick(t.common.intensity)}
            <input
              type="range"
              min={0}
              max={100}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
            />
          </label>
          <BeforeAfterViewer
            imageUrl={imageUrl}
            activeZones={activeZones}
            intensity={intensity}
            points={points}
            onAddPoint={(x, y) => setPoints((p) => [...p, { id: crypto.randomUUID(), x, y }])}
            mode="split"
          />
        </section>
      )}

      {step === 3 && (
        <section className="detail-panel">
          <h2>{pick(t.consultation.stepDocument)}</h2>
          <ul>
            <li>
              {pick(t.nav.regions)}: {summary.region}
            </li>
            <li>
              {pick(t.nav.materials)}: {summary.material}
            </li>
            <li>
              {pick(t.nav.techniques)}: {summary.technique}
            </li>
            <li>Dose: {summary.dose || "—"}</li>
            <li>
              Zones: {summary.zones} · Points: {summary.points}
            </li>
            <li>
              <label style={{ display: "grid", gap: "0.35rem" }}>
                Notes
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
              </label>
            </li>
          </ul>
          <button type="button" className="btn primary" onClick={exportText}>
            {pick(t.common.exportPlan)}
          </button>
        </section>
      )}

      <div className="consult-nav">
        <button type="button" className="btn ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          {pick(t.common.prevStep)}
        </button>
        <button
          type="button"
          className="btn primary"
          disabled={step === STEPS.length - 1}
          onClick={() => setStep((s) => s + 1)}
        >
          {pick(t.common.nextStep)}
        </button>
      </div>
    </div>
  );
}
