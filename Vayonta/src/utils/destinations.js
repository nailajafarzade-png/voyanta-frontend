/**
 * Backend Destination { id, name, country, imageUrl, tag } → dizaynın kart formatı
 * { id, title, subtitle, imageUrl }. Beləliklə kartların markup-ı dəyişmir.
 */
export function toPlace(destination) {
  return {
    id: destination.id,
    title: `${destination.name}, ${destination.country}`,
    subtitle: destination.tag,
    imageUrl: destination.imageUrl,
  };
}
