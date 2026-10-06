import { useCallback, useEffect, useState } from "react";
import {
    addFavorite as addFavoriteApi,
    listFavorites as listFavoritesApi,
    removeFavorite as removeFavoriteApi,
    removeFavoriteById as removeFavoriteByIdApi,
} from "../api/favorites";

const FAVORITES_KEY = "voyanta:favorites";

/**
 * Loads and manages the current user's favorites.
 * Favorites are keyed by `itemType|itemId` for fast lookup.
 */
export function useFavorites() {
    const [favorites, setFavorites] = useState(() => loadFromStorage());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        setIsLoading(true);
        listFavoritesApi()
            .then((items) => {
                if (!cancelled) {
                    const map = new Map();
                    for (const item of items) {
                        map.set(`${item.itemType}|${item.itemId}`, item);
                    }
                    setFavorites(map);
                    saveToStorage(map);
                    setIsLoading(false);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const isFavorite = useCallback(
        (itemType, itemId) => {
            return favorites.has(`${itemType}|${itemId}`);
        },
        [favorites]
    );

    const toggleFavorite = useCallback(
        async (itemType, itemId, snapshot) => {
            const key = `${itemType}|${itemId}`;
            const existing = favorites.get(key);

            const saved = new Map(favorites);

            if (existing) {
                saved.delete(key);
                setFavorites(saved);
                saveToStorage(saved);

                try {
                    await removeFavoriteApi(itemType, itemId);
                } catch (err) {
                    const rollback = new Map(favorites);
                    rollback.set(key, existing);
                    setFavorites(rollback);
                    saveToStorage(rollback);
                    throw err;
                }
            } else {
                saved.set(key, { id: "pending", itemType, itemId, createdAt: new Date().toISOString(), snapshot });
                setFavorites(saved);
                saveToStorage(saved);

                try {
                    const result = await addFavoriteApi(itemType, itemId);
                    const updated = new Map(saved);
                    updated.set(key, { ...result, snapshot });
                    setFavorites(updated);
                    saveToStorage(updated);
                } catch (err) {
                    const rollback = new Map(favorites);
                    rollback.delete(key);
                    setFavorites(rollback);
                    saveToStorage(rollback);
                    throw err;
                }
            }
        },
        [favorites]
    );

    return { favorites, isLoading, isFavorite, toggleFavorite };
}

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        if (!raw) return new Map();
        return new Map(JSON.parse(raw));
    } catch {
        return new Map();
    }
}

function saveToStorage(map) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...map]));
    } catch {
        // ignore
    }
}

export default useFavorites;
