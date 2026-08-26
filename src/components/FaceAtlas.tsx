import { atlasRegions } from "../data/clinical/journey";
import { FACE_ATLAS_IDS } from "../data/clinical/regionPacks";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";
import { STITCH } from "../lib/assets";

const SPOTS: Record<string, { x: number; y: number; r: number }> = {
  forehead: { x: 52, y: 24, r: 4.4 },
  glabella: { x: 50, y: 34, r: 3.5 },
  temple: { x: 28, y: 36, r: 3.8 },
  periocular: { x: 40, y: 42, r: 3.6 },
  nose: { x: 48, y: 52, r: 3.2 },
  cheeks: { x: 36, y: 58, r: 4.8 },
  lips: { x: 48, y: 70, r: 3.8 },
  jawline: { x: 34, y: 78, r: 3.8 },
  chin: { x: 48, y: 84, r: 3.4 },
  neck: { x: 50, y: 96, r: 4.2 },
};

const MIRRORS = new Set(["temple", "periocular", "cheeks", "jawline"]);

type Props = {
  selectedId?: string;
  onSelect: (regionId: string) => void;
  ids?: readonly string[];
};

export function RegionChips({ selectedId, onSelect, ids = FACE_ATLAS_IDS }: Props) {
  const { locale, strings, t } = useLocale();
  const regions = atlasRegions();

  return (
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
  );
}

export function FaceAtlas({ selectedId, onSelect, ids = FACE_ATLAS_IDS }: Props) {
  const { locale, strings, t } = useLocale();
  const regions = atlasRegions();

  return (
    <div className="atlas-canvas">
      <img className="atlas-photo" src={STITCH.atlasPlate} alt="" />
      <svg className="atlas-svg" viewBox="0 0 100 110" role="img" aria-label={t(strings.home.atlasAnatomical)}>
        <ellipse cx="50" cy="56" rx="30" ry="40" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="0.45" />
        {ids.map((id) => {
          const region = regions.find((item) => item.id === id);
          const spot = SPOTS[id];
          if (!region || !spot) return null;
          const copies = MIRRORS.has(id) ? [spot, { ...spot, x: Math.min(78, 100 - spot.x + 8) }] : [spot];
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
                <text x={copy.x} y={copy.y - copy.r - 2.6} textAnchor="middle">
                  {entityName(region, locale)}
                </text>
              ) : null}
            </g>
          ));
        })}
      </svg>
    </div>
  );
}
