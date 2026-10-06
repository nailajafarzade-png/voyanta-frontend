import { useMemo } from "react";
import { useFavorites } from "../../hooks/useFavorites";
import { getDestinationsByIds } from "../../api/destinations";
import SectionHeading from "../../components/common/SectionHeading";
import Reveal from "../../components/common/Reveal";
import DestinationCard from "../../components/common/DestinationCard";
import { CardSkeleton, EmptyState } from "../../components/common/States";

function FavoritesPage() {
    const { favorites, isLoading, isFavorite, toggleFavorite } = useFavorites();

    const destinationFavorites = useMemo(() => {
        return [...favorites.values()].filter((f) => f.itemType === "destination");
    }, [favorites]);

    const [places, setPlaces] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        if (destinationFavorites.length === 0) {
            setPlaces([]);
            setPageLoading(false);
            return;
        }

        setPageLoading(true);
        const ids = destinationFavorites.map((f) => f.itemId);
        getDestinationsByIds(ids)
            .then((destinations) => {
                if (!cancelled) {
                    setPlaces(destinations.filter(Boolean));
                    setPageLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setPageLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [destinationFavorites]);

    return (
        <section className="min-h-screen bg-canvas px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <Reveal>
                    <SectionHeading
                        eyebrow={{ text: "Bəyəndiklərim", tone: "brand", icon: "❤️" }}
                        title="Bəyəndiyin istiqamətlər"
                        description="Sevdiyin yerləri burada saxla və rahatlıqla yenidən bax."
                    />
                </Reveal>

                {isLoading || pageLoading ? (
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="aspect-[3/4] rounded-[28px] bg-slate-200" />
                        ))}
                    </div>
                ) : places.length === 0 ? (
                    <EmptyState
                        className="mt-10"
                        icon="❤️"
                        title="Hələ bəyəndiyin yer yoxdur"
                        description="İstədiyin istiqamətləri ürək işarəsinə klikləyərək burada saxla."
                    />
                ) : (
                    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {places.map((place, index) => (
                            <DestinationCard
                                key={place.id}
                                place={place}
                                sectionKey="favorites"
                                index={index}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default FavoritesPage;
