import type { Locale } from "../i18n/types";
import { findingLabel } from "../lib/clinicalScan";
import type { ScanFinding } from "../lib/scanTypes";
import { useLocale } from "../i18n/LocaleContext";

export type PlanRow = {
  finding: ScanFinding;
  region: string;
  treatment: string;
  material: string;
  dose: string;
  plane: string;
};

type Props = {
  rows: PlanRow[];
  locale: Locale;
  onToggle: (id: string, enabled: boolean) => void;
};

export function PlanTable({ rows, locale, onToggle }: Props) {
  const { strings, t } = useLocale();

  return (
    <div className="sim-table-wrap">
      <table className="sim-table">
        <thead>
          <tr>
            <th>{t(strings.sim.colInclude)}</th>
            <th>{t(strings.sim.colRegion)}</th>
            <th>{t(strings.sim.colFinding)}</th>
            <th>{t(strings.sim.colSeverity)}</th>
            <th>{t(strings.sim.colTreatment)}</th>
            <th>{t(strings.sim.colMaterial)}</th>
            <th>{t(strings.sim.colDose)}</th>
            <th>{t(strings.sim.colPlane)}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.finding.id} className={row.finding.enabled ? undefined : "off"}>
              <td>
                <input
                  type="checkbox"
                  checked={row.finding.enabled}
                  onChange={(event) => onToggle(row.finding.id, event.target.checked)}
                  aria-label={t(strings.sim.colInclude)}
                />
              </td>
              <td>{row.region}</td>
              <td>{findingLabel(row.finding, locale)}</td>
              <td>{row.finding.severity}</td>
              <td>{row.treatment}</td>
              <td>{row.material}</td>
              <td>{row.dose}</td>
              <td>{row.plane}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
