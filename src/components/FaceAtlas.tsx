import { atlasRegions } from "../data/clinical/journey";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";
import { USER_LIPS } from "../lib/assets";

const SPOTS: Record<string, { x: number; y: number; rx: number; ry: number }> = {
  forehead: { x: 50, y: 26, rx: 16, ry: 7 },
  glabella: { x: 50, y: 36, rx: 7, ry: 4 },
  temple: { x: 22, y: 38, rx: 7, ry: 8 },
  periocular: { x: 36, y: 46, rx: 8, ry: 5 },
  cheeks: { x: 32, y: 64, rx: 10, ry: 9 },
  lips: { x: 50, y: 78, rx: 11, ry: 5 },
  masseter: { x: 24, y: 78, rx: 7, ry: 8 },
  tmj: { x: 18, y: 58, rx: 5, ry: 5 },
  jawline: { x: 30, y: 94, rx: 9, ry: 6 },
  chin: { x: 50, y: 98, rx: 7, ry: 5 },
  neck: { x: 50, y: 114, rx: 12, ry: 6 },
  axilla: { x: 8, y: 78, rx: 6, ry: 8 },
};

type Props = {
  selectedId?: string;
  onSelect: (regionId: string) => void;
};

export function FaceAtlas({ selectedId, onSelect }: Props) {
  const { locale, strings, t } = useLocale();
  const regions = atlasRegions();

  return (
    <div className="atlas-canvas">
      <img className="atlas-photo" src={USER_LIPS.anatomy[0] ?? USER_LIPS.before} alt="" />
      <svg className="atlas-svg" viewBox="0 0 100 132" role="img" aria-label={t(strings.home.atlasTitle)}>
        <ellipse cx="50" cy="62" rx="28" ry="38" fill="none" stroke="#171616" strokeWidth="0.7" opacity="0.55" />
        <path
          d="M36 98 C38 112, 62 112, 64 98"
          fill="none"
          stroke="#171616"
          strokeWidth="0.6"
          opacity="0.4"
        />
        <path d="M42 76 C50 80, 58 76, 58 76" fill="none" stroke="#171616" strokeWidth="0.7" />
        <circle cx="38" cy="46" r="3.2" fill="none" stroke="#171616" strokeWidth="0.5" />
        <circle cx="62" cy="46" r="3.2" fill="none" stroke="#171616" strokeWidth="0.5" />
        {regions.map((region) => {
          const spot = SPOTS[region.id];
          if (!spot) return null;
          const mirrors = ["temple", "periocular", "cheeks", "masseter", "tmj", "jawline", "axilla"];
          const copies = mirrors.includes(region.id)
            ? [
                { ...spot },
                { ...spot, x: 100 - spot.x },
              ]
            : [{ ...spot }];
          return copies.map((copy, index) => (
            <g
              key={`${region.id}-${index}`}
              className={`hotspot${selectedId === region.id ? " active" : ""}`}
              onClick={() => onSelect(region.id)}
              role="button"
              tabIndex={0}
              aria-label={entityName(region, locale)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(region.id);
              }}
            >
              <ellipse cx={copy.x} cy={copy.y} rx={copy.rx} ry={copy.ry} />
              {index === 0 && selectedId === region.id ? (
                <text x={copy.x} y={copy.y - copy.ry - 2} textAnchor="middle">
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
