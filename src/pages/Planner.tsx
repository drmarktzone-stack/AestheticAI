import { useMemo, useState } from "react";
import { materials, regions } from "../data";
import { PageHeader } from "../components/ui";
import "./Planner.css";

interface PlanLine {
  regionId: string;
  materialId: string;
  volumeOrUnits: string;
  notes: string;
}

const emptyLine = (): PlanLine => ({
  regionId: regions[0]?.id ?? "",
  materialId: materials[0]?.id ?? "",
  volumeOrUnits: "",
  notes: "",
});

export function PlannerPage() {
  const [patientCode, setPatientCode] = useState("");
  const [goal, setGoal] = useState("");
  const [lines, setLines] = useState<PlanLine[]>([emptyLine()]);

  const summary = useMemo(() => {
    return lines
      .filter((l) => l.volumeOrUnits.trim())
      .map((l) => {
        const region = regions.find((r) => r.id === l.regionId)?.nameHe ?? l.regionId;
        const material = materials.find((m) => m.id === l.materialId)?.nameHe ?? l.materialId;
        return `${region}: ${material} — ${l.volumeOrUnits}${l.notes ? ` (${l.notes})` : ""}`;
      });
  }, [lines]);

  function updateLine(index: number, patch: Partial<PlanLine>) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)));
  }

  function addLine() {
    setLines((prev) => [...prev, emptyLine()]);
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <PageHeader
        eyebrow="תכנון מפגש"
        title="מתכנן טיפול"
        lead="בנה רשימת אזורים/חומרים/מינונים לפני ההזרקה. הנתונים נשארים במכשיר עד לרענון."
      />

      <div className="planner-form">
        <label>
          קוד מטופל / ראשי תיבות
          <input value={patientCode} onChange={(e) => setPatientCode(e.target.value)} />
        </label>
        <label>
          מטרת המפגש
          <input
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="לדוגמה: תמיכת midface + רענון שפתיים"
          />
        </label>
      </div>

      <div className="plan-lines">
        {lines.map((line, index) => (
          <div className="plan-line" key={index}>
            <label>
              אזור
              <select
                value={line.regionId}
                onChange={(e) => updateLine(index, { regionId: e.target.value })}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nameHe}
                  </option>
                ))}
              </select>
            </label>
            <label>
              חומר
              <select
                value={line.materialId}
                onChange={(e) => updateLine(index, { materialId: e.target.value })}
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nameHe}
                  </option>
                ))}
              </select>
            </label>
            <label>
              נפח / יחידות
              <input
                value={line.volumeOrUnits}
                onChange={(e) => updateLine(index, { volumeOrUnits: e.target.value })}
                placeholder="לפי IFU שלך"
              />
            </label>
            <label>
              הערות
              <input
                value={line.notes}
                onChange={(e) => updateLine(index, { notes: e.target.value })}
                placeholder="מחט/קנולה, מישור..."
              />
            </label>
            <button type="button" className="linkish" onClick={() => removeLine(index)}>
              הסר
            </button>
          </div>
        ))}
      </div>

      <div className="planner-actions">
        <button type="button" className="btn primary" onClick={addLine}>
          הוסף שורה
        </button>
      </div>

      <section className="detail-panel" style={{ marginTop: "1.25rem" }}>
        <h2>סיכום תכנון</h2>
        <p className="planner-meta">
          {patientCode ? `מטופל: ${patientCode}` : "ללא קוד מטופל"}
          {goal ? ` · מטרה: ${goal}` : ""}
        </p>
        {summary.length === 0 ? (
          <p className="empty-state">הוסף נפח/יחידות כדי לבנות סיכום.</p>
        ) : (
          <ul>
            {summary.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
