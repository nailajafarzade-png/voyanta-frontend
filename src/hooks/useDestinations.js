import { useCallback, useEffect, useState } from "react";
import { getFeaturedDestinations } from "../api/destinations";
import { getPersonalizedDestinations } from "../api/recommendations";
import { apiErrorMessage } from "../api/errors";
import { toPlace } from "../utils/destinations";

/**
 * Ana səhifədə 3 bölmə (tövsiyələr / trend / mövsümi) eyni siyahını göstərir.
 * Əvvəllər hər biri ayrı-ayrı sorğu göndərirdi — indi modul səviyyəsində
 * BİR sorğu göndərilir və nəticə bütün səhifə üçün paylaşılır.
 *
 * Yeni endpoint yoxdur: eyni `GET /destinations/featured` və
 * `GET /recommendations/personalized` çağırılır.
 */
const cache = new Map(); // key -> { places, at }
const inFlight = new Map(); // key -> Promise (eşzamanlı sorğuları birləşdirir)

const MAX_AGE_MS = 5 * 60 * 1000; // 5 dəqiqə

function readCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > MAX_AGE_MS) {
    cache.delete(key);
    return null;
  }
  return entry;
}

/**
 * Eyni anda bir neçə komponent (tövsiyələr / trend / mövsüm / istiqamətlər)
 * bu hook-u çağırsın deyə, gözləyən sorğu `inFlight` xəritəsində saxlanılır.
 * Beləliklə səhifə yükləndikdə BİR şəbəkə sorğusu göndərilir.
 */
function load(key) {
  const existing = inFlight.get(key);
  if (existing) return existing;

  const request = (async () => {
    const destinations =
      key === "personalized"
        ? await getPersonalizedDestinations(12)
        : await getFeaturedDestinations(12);

    const places = (destinations ?? []).map(toPlace);
    cache.set(key, { places, at: Date.now() });
    return places;
  })().finally(() => {
    inFlight.delete(key);
  });

  inFlight.set(key, request);
  return request;
}

/**
 * @param {{ isAuthenticated: boolean, isAuthLoading?: boolean, limit?: number }} params
 */
export function useDestinations({ isAuthenticated, isAuthLoading = false, limit }) {
  const key = isAuthenticated ? "personalized" : "featured";
  const initial = readCache(key);

  const [state, setState] = useState(() => ({
    places: initial?.places ?? [],
    isLoading: !initial,
    error: null,
  }));

  // "Yenidən cəhd et" üçün effect-i yenidən başlatma qaldırıcısı
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (isAuthLoading) return undefined;

    const cached = readCache(key);
    if (cached) {
      setState({ places: cached.places, isLoading: false, error: null });
      return undefined;
    }

    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    (async () => {
      try {
        const places = await load(key);

        if (!cancelled) {
          setState({ places, isLoading: false, error: null });
        }
      } catch (caught) {
        if (!cancelled) {
          setState({ places: [], isLoading: false, error: apiErrorMessage(caught) });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key, isAuthLoading, retryKey]);

  const places =
    typeof limit === "number" ? state.places.slice(0, limit) : state.places;

  // "Yenidən cəhd et" — yaddaşı təmizləyib sorğunu təkrar edir
  const reload = useCallback(() => {
    cache.delete(key);
    setRetryKey((n) => n + 1);
  }, [key]);

  return {
    places,
    allPlaces: state.places,
    isLoading: state.isLoading,
    error: state.error,
    reload,
  };
}

export default useDestinations;
