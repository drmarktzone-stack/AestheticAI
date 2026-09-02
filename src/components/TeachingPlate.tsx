import { DemoBadge } from "./Chrome";
import { pickL } from "../data/clinical/types";
import type { RegionPack } from "../data/clinical/regionPacks";
import { useLocale } from "../i18n/LocaleContext";

type Props = {
  photo: string;
  pack: RegionPack;
};

export function TeachingPlate({ photo, pack }: Props) {
  const { locale, strings, t } = useLocale();

  return (
    <div className="teach-plate">
      <div className="teach-canvas">
        <img src={photo} alt="" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {pack.injectionPoints.map((point) => (
            <g key={point.id}>
              <circle
                className={point.danger ? "teach-dot danger" : "teach-dot"}
                cx={point.x}
                cy={point.y}
                r={point.danger ? 3.4 : 2.6}
              />
              <text x={point.x} y={Math.max(6, point.y - 5)} textAnchor="middle">
                {pickL(locale, point.label)}
              </text>
            </g>
          ))}
        </svg>
        <div className="teach-caption">
          <DemoBadge label={t(strings.demo)} />
          <span className="badge draft">{t(strings.journey.map)}</span>
        </div>
      </div>
      <aside className="teach-legend">
        <div className="kicker">{t(strings.journey.map)}</div>
        <p className="muted">{pickL(locale, pack.subtitle)}</p>
        <ul className="teach-list">
          {pack.injectionPoints.map((point) => (
            <li key={point.id} className={point.danger ? "danger" : undefined}>
              <strong>{pickL(locale, point.label)}</strong>
              <span>{pickL(locale, point.dose)}</span>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export function StillGallery({ stills, alt }: { stills: string[]; alt: string }) {
  const { strings, t } = useLocale();
  const frames = stills.filter(Boolean).slice(0, 4);
  if (!frames.length) return null;

  return (
    <div className="still-gallery">
      {frames.map((src, index) => (
        <figure key={`${src}-${index}`} className="gallery-tile">
          <img src={src} alt={`${alt} ${index + 1}`} />
          <figcaption>
            <DemoBadge label={t(strings.demo)} />
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
