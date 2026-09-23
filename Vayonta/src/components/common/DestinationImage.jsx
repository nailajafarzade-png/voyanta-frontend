import { useEffect, useState } from "react";
import { resolveLocalImage } from "../../utils/localImages";

/**
 * Backend `imageUrl` qaytarır, amma seed data-dakı placeholder linklər açılmır.
 * Şəkil yüklənməyəndə dizaynın öz şəkillərindən adına uyğun olan göstərilir,
 * tapılmasa boz gradient (qırıq şəkil ikonu görünmür).
 */
function DestinationImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const resolved = !src || failed ? resolveLocalImage(src, alt) : src;

  if (!resolved) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} bg-gradient-to-tr from-slate-400 via-slate-300 to-slate-200`}
      />
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export default DestinationImage;
