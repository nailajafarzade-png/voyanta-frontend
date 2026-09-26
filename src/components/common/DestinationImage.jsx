import { useEffect, useState } from "react";
import { resolveLocalImage } from "../../utils/localImages";
import { getSeason } from "../../utils/season";

/**
 * Backend `imageUrl` qaytarır, amma seed data-dakı placeholder linklər açılmır.
 * Şəkil yüklənməyəndə dizaynın öz şəkillərindən adına uyğun olan göstərilir,
 * tapılmasa boz gradient (qırıq şəkil ikonu görünmür).
 *
 * `season` verildikdə şəklin üzərinə mövsüm rəng qatı əlavə olunur ki, vizual
 * olaraq cari ilə uyğun görünsün (PO tələbi #1).
 */
function DestinationImage({ src, alt, className = "", season = false, eager = false }) {
  const [failed, setFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setIsLoaded(false);
  }, [src]);

  const resolved = !src || failed ? resolveLocalImage(src, alt) : src;
  const seasonClass = season ? getSeason().grade : "";

  if (!resolved) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} ${seasonClass} bg-gradient-to-tr from-slate-300 via-slate-200 to-slate-400`}
      />
    );
  }

  return (
    <div className={`${className} ${seasonClass} voy-grade relative bg-slate-200`}>
      <img
        src={resolved}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        onLoad={() => setIsLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Şəkil yüklənməyənə qədər skelet */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          className="voy-skeleton pointer-events-none absolute inset-0"
        />
      )}
    </div>
  );
}

export default DestinationImage;

