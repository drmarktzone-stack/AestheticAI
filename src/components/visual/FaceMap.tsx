import { useLocale } from "../../i18n";
import { faceZones } from "../../data/faceZones";
import { getRegion } from "../../data";
import "./visual.css";

interface FaceMapProps {
  selectedZoneIds: string[];
  onToggleZone: (zoneId: string) => void;
  showDanger?: boolean;
}

export function FaceMap({ selectedZoneIds, onToggleZone, showDanger = true }: FaceMapProps) {
  const { locale, pick } = useLocale();

  return (
    <div className="face-map-wrap">
      <svg viewBox="0 0 100 100" className="face-map-svg" aria-label="Face map">
        <ellipse cx="50" cy="52" rx="32" ry="40" className="face-outline" />
        <ellipse cx="50" cy="38" rx="22" ry="26" className="face-inner" />
        <ellipse cx="38" cy="36" rx="4" ry="2.5" className="face-feature" />
        <ellipse cx="62" cy="36" rx="4" ry="2.5" className="face-feature" />
        <path d="M 44 62 Q 50 66 56 62" className="face-feature" fill="none" />

        {faceZones.map((zone) => {
          const region = getRegion(zone.regionId);
          const selected = selectedZoneIds.includes(zone.id);
          const isCritical = region?.risk === "critical" || region?.risk === "high";
          const cx = zone.cx * 100;
          const cy = zone.cy * 100;
          const rx = zone.rx * 100;
          const ry = zone.ry * 100;

          return (
            <g key={zone.id}>
              <ellipse
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                className={`zone-hit ${selected ? "selected" : ""} ${showDanger && isCritical ? "danger" : ""}`}
                onClick={() => onToggleZone(zone.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onToggleZone(zone.id)}
              />
              {selected ? (
                <ellipse cx={cx} cy={cy} rx={rx * 0.35} ry={ry * 0.35} className="zone-core" />
              ) : null}
            </g>
          );
        })}
      </svg>
      <ul className="zone-legend">
        {faceZones.map((z) => {
          const region = getRegion(z.regionId);
          if (!region) return null;
          const name =
            locale === "he"
              ? region.nameHe
              : locale === "ar"
                ? region.nameAr ?? region.nameHe
                : region.nameEn;
          return (
            <li key={z.id}>
              <button
                type="button"
                className={selectedZoneIds.includes(z.id) ? "active" : ""}
                onClick={() => onToggleZone(z.id)}
              >
                {name}
                {showDanger && (region.risk === "critical" || region.risk === "high") ? (
                  <span className="danger-dot" title={pick({ he: "סיכון גבוה", ar: "خطر مرتفع", en: "High risk" })} />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
