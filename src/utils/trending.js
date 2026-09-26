/**
 * Trending reytinqi — sabit (deterministik) hash.
 *
 * Backend-də "populyarlıq" rəqəmi yoxdur, ona görə reytinq UUID-dən hesablanır:
 * eyni istiqamət hər yükləmədə eyni yerdə qalır (təsadüfi "sürüşmə" olmur).
 * Yeni endpoint yaratmır, mövcud destination məlumatını istifadə edir.
 */

/** FNV-1a 32-bit hash */
function hash32(value) {
  let hash = 0x811c9dc5;
  const text = String(value ?? "");
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash >>> 0;
}

/** 0..1 aralığında sabit ədəd */
export function trendScore(id) {
  return hash32(id) / 0xffffffff;
}

/** 0..1 aralığında sabit "bəyənmə" sayı (görünməz rəqəm, vizual yoğunluq üçün) */
export function likeRatio(id) {
  return hash32(`${id}::likes`) / 0xffffffff;
}

/** Reytinqi ən yüksək trenddən başlayaraq sıralayır (kopyalamadan qaytarır). */
export function sortByTrending(places) {
  return [...places].sort((a, b) => trendScore(b.id) - trendScore(a.id));
}

/** 1-ci yer üçün "#1" kimi qısa etiket. */
export function trendRankLabel(index) {
  return `#${index + 1}`;
}
