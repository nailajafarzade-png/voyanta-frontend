import api, { unwrap } from "./axios";
/** GET /api/destinations/featured — auth tələb olunmur, opsional `limit`. */
export async function getFeaturedDestinations(limit) {
    const response = await api.get("/destinations/featured", {
        params: limit ? { limit } : undefined,
    });
    return unwrap(response) ?? [];
}

/**
 * GET /api/destinations/trending — açıq endpoint.
 *
 * Reytinq tamamilə BACKEND-də hesablanır (son 30 gündə favoriləşdirilənlər).
 * Frontend heç bir populyarlıq/trend ölçüsü hesablamır, sıranı olduğu kimi
 * qəbul edir. `exclude` = eyni səhifədə artıq göstərilən istiqamət ID-ləri;
 * backend heç nə qalmasayara siyahını tamamlayır (relevans qurban gedmir).
 */
export async function getTrendingDestinations(limit, exclude) {
    const response = await api.get("/destinations/trending", {
        params: {
            ...(limit ? { limit } : {}),
            ...(exclude?.length ? { exclude } : {}),
        },
    });
    return unwrap(response) ?? [];
}

/**
 * GET /api/destinations/popular — açıq endpoint.
 *
 * Ən çox favoriləşdirilən istiqamətlər. Reytinq yalnız backend-də hesablanır;
 * "populyarlıq uyğunluğu üstə keçmir" qaydası server tərəfdədir.
 */
export async function getPopularDestinations(limit, exclude) {
    const response = await api.get("/destinations/popular", {
        params: {
            ...(limit ? { limit } : {}),
            ...(exclude?.length ? { exclude } : {}),
        },
    });
    return unwrap(response) ?? [];
}
