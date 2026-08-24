import { useLocale } from "../../i18n";
import type { DriveVideo } from "../../lib/driveMedia";
import "./clinical-video.css";

export function ClinicalVideo({
  video,
  autoPlay = false,
}: {
  video: DriveVideo;
  autoPlay?: boolean;
}) {
  const { locale } = useLocale();
  return (
    <figure className="cvid">
      <video
        controls
        playsInline
        preload="metadata"
        autoPlay={autoPlay}
        muted={autoPlay}
        loop={autoPlay}
        poster={video.poster}
      >
        <source src={video.src} type="video/mp4" />
      </video>
      <figcaption>{video.title[locale]}</figcaption>
    </figure>
  );
}

export function ClinicalVideoGrid({ videos }: { videos: DriveVideo[] }) {
  if (!videos.length) return null;
  return (
    <div className="cvid-grid">
      {videos.map((v) => (
        <ClinicalVideo key={v.id} video={v} />
      ))}
    </div>
  );
}
