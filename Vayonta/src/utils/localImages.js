import maldiv from "../assets/maldiv.png";
import santorini from "../assets/santorini.png";
import misir from "../assets/misir.png";
import ismayilli from "../assets/ismayıllı.png";
/**
 * Backend seed data-sında placeholder şəkil linkləri var (https://placeholder.voyanta.az/...)
 * və onlar açılmır. İstiqamətin adına/link-in adına görə dizaynın öz şəkillərindən
 * uyğun olanı seçilir; tapılmasa null qaytarılır.
 */
const LOCAL_IMAGES = [
    { keywords: ["maldiv"], image: maldiv },
    { keywords: ["santorini"], image: santorini },
    { keywords: ["egypt", "misir", "cairo", "giza", "pyramid", "piramid"], image: misir },
    { keywords: ["ismayil", "mayıl"], image: ismayilli },
];
export function resolveLocalImage(src, alt) {
    const haystack = `${src ?? ""} ${alt}`.toLowerCase();
    const match = LOCAL_IMAGES.find((entry) => entry.keywords.some((keyword) => haystack.includes(keyword)));
    return match ? match.image : null;
}
