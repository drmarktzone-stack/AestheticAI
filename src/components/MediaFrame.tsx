import { DemoBadge } from "./Chrome";
import { useLocale } from "../i18n/LocaleContext";

type Props = {
  src?: string;
  poster?: string;
  kind?: "image" | "video";
  alt: string;
};

export function MediaFrame({ src, poster, kind = "image", alt }: Props) {
  const { strings, t } = useLocale();
  if (!src) {
    return (
      <div className="media-frame">
        <div className="status empty">{t(strings.empty)}</div>
      </div>
    );
  }

  return (
    <figure className="media-frame">
      {kind === "video" ? (
        <video src={src} poster={poster} controls playsInline muted loop />
      ) : (
        <img src={src} alt={alt} />
      )}
      <figcaption className="caption">
        <DemoBadge label={t(strings.demo)} />
        <span className="badge draft">{t(strings.demoMedia)}</span>
      </figcaption>
    </figure>
  );
}
