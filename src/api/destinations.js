import api, { unwrap } from "./axios";
/** GET /api/destinations/featured — auth tələb olunmur, opsional `limit`. */
export async function getFeaturedDestinations(limit) {
    const response = await api.get("/destinations/featured", {
        params: limit ? { limit } : undefined,
    });
    return unwrap(response) ?? [];
}
