import { faceZones, ZONE_LABELS, zonesForRegion } from "../data/faceZones";
import { atlasRegions } from "../data/clinical/journey";
import { entityName } from "../lib/entityName";
import { useLocale } from "../i18n/LocaleContext";

type Props = {
  photo: string;
  selected: string[];
  onToggle: (zoneId: string) => void;
  onToggleRegion?: (regionId: string) => void;
  dangerRegionIds?: string[];
};

const HIDDEN_REGIONS = new Set(["body"]);

export function InjectionMap({ photo, selected, onToggle, onToggleRegion, dangerRegionIds = [] }: Props) {
  const { locale, strings, t } = useLocale();
  const regions = atlasRegions();
  const selectedRegions = regions.filter((region) =>
    zonesForRegion(region.id).some((id) => selected.includes(id) || selected.includes(region.id)),
  );

  return (
    <div className="map-block">
      <div className="map-wrap">
        <img src={photo} alt="" />
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          {faceZones
            .filter((zone) => !HIDDEN_REGIONS.has(zone.regionId))
            .map((zone) => {
              const active = selected.includes(zone.id) || selected.includes(zone.regionId);
              const danger = dangerRegionIds.includes(zone.regionId);
              return (
                <g
                  key={zone.id}
                  onClick={() => (onToggleRegion ? onToggleRegion(zone.regionId) : onToggle(zone.id))}
                >
                  <ellipse
                    className={`zone${active ? " selected" : ""}${danger ? " danger" : ""}`}
                    cx={zone.cx * 100}
                    cy={zone.cy * 100}
                    rx={zone.rx * 100}
                    ry={zone.ry * 100}
                  />
                  {active ? (
                    <text
                      x={zone.cx * 100}
                      y={zone.cy * 100}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize="2.6"
                      style={{ pointerEvents: "none" }}
                    >
                      {ZONE_LABELS[zone.id]?.[locale] ?? zone.id}
                    </text>
                  ) : null}
                </g>
              );
            })}
        </svg>
      </div>
      <div className="map-selected">
        <span className="kicker">{t(strings.planner.marked)}</span>
        {selectedRegions.length ? (
          <p>
            {selectedRegions.map((region) => entityName(region, locale)).join(" · ")}
          </p>
        ) : (
          <p className="tiny">{t(strings.planner.tapMap)}</p>
        )}
      </div>
    </div>
  );
}
