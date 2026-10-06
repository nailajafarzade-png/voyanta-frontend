import api, { unwrap } from "./axios";

/** GET /api/favorites — AUTH tələb olunur. */
export async function listFavorites() {
    const response = await api.get("/favorites");
    return unwrap(response) ?? [];
}

/** POST /api/favorites — AUTH tələb olunur. */
export async function addFavorite(itemType, itemId) {
    const response = await api.post("/favorites", { itemType, itemId });
    return unwrap(response);
}

/** DELETE /api/favorites/{id} — AUTH tələb olunur. */
export async function removeFavoriteById(favoriteId) {
    await api.delete(`/favorites/${favoriteId}`);
}

/** DELETE /api/favorites?itemType=...&itemId=... — AUTH tələb olunur. */
export async function removeFavorite(itemType, itemId) {
    await api.delete("/favorites", { data: { itemType, itemId } });
}
