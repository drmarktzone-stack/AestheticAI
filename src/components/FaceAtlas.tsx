import { atlasRegions } from "../data/clinical/journey";
import { FACE_ATLAS_IDS } from "../data/clinical/regionPacks";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";
import { USER_LIPS } from "../lib/assets";

const SPOTS: Record<string, { x: number; y: number; r: number }> = {
  forehead: { x: 50, y: 22, r: 4.2 },
  glabella: { x: 50, y: 34, r: 3.4 },
  temple: { x: 22, y: 36, r: 3.6 },
  periocular: { x: 36, y: 44, r: 3.8 },
  nose: { x: 50, y: 54, r: 3.2 },
  cheeks: { x: 32, y: 62, r: 4.6 },
  lips: { x: 50, y: 76, r: 3.8 },
  masseter: { x: 24, y: 76, r: 3.6 },
  tmj: { x: 18, y: 56, r: 3.2 },
  jawline: { x: 30, y: 90, r: 3.8 },
  chin: { x: 50, y: 96, r: 3.4 },
  neck: { x: 50, y: 112, r: 4.2 },
  axilla: { x: 8, y: 76, r: 3.4 },
  migraine: { x: 28, y: 18, r: 3.6 },
};

const MIRRORS = new Set(["temple", "periocular", "cheeks", "masseter", "tmj", "jawline", "axilla"]);

type Props = {
  selectedId?: string;
  onSelect: (regionId: string) => void;
  ids?: readonly string[];
};

export function FaceAtlas({ selectedId, onSelect, ids = FACE_ATLAS_IDS }: Props) {
  const { locale, strings, t } = useLocale();
  const regions = atlasRegions();

  return (
    <div className="atlas-block">
      <div className="atlas-legend" aria-label={t(strings.home.atlasAnatomical)}>
        {ids.map((id) => {
          const region = regions.find((item) => item.id === id);
          if (!region) return null;
          return (
            <button
              key={id}
              type="button"
              className={`chip${selectedId === id ? " active" : ""}`}
              aria-pressed={selectedId === id}
              onClick={() => onSelect(id)}
            >
              {entityName(region, locale)}
            </button>
          );
        })}
      </div>
      <div className="atlas-canvas">
        <img className="atlas-photo" src={USER_LIPS.anatomy[0] ?? USER_LIPS.before} alt="" />
        <svg className="atlas-svg" viewBox="0 0 100 132" role="img" aria-label={t(strings.home.atlasAnatomical)}>
          <ellipse cx="50" cy="62" rx="28" ry="38" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5" />
          {ids.map((id) => {
            const region = regions.find((item) => item.id === id);
            const spot = SPOTS[id];
            if (!region || !spot) return null;
            const copies = MIRRORS.has(id) ? [spot, { ...spot, x: 100 - spot.x }] : [spot];
            return copies.map((copy, index) => (
              <g
                key={`${id}-${index}`}
                className={`hotspot${selectedId === id ? " active" : ""}`}
                onClick={() => onSelect(id)}
                role="button"
                tabIndex={0}
                aria-label={entityName(region, locale)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") onSelect(id);
                }}
              >
                <circle cx={copy.x} cy={copy.y} r={copy.r} />
                {index === 0 && selectedId === id ? (
                  <text x={copy.x} y={copy.y - copy.r - 2.4} textAnchor="middle">
                    {entityName(region, locale)}
                  </text>
                ) : null}
              </g>
            ));
          })}
        </svg>
      </div>
    </div>
  );
}
