import { useCallback, useEffect, useRef, useState } from "react";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
let scriptLoadPromise = null;
/**
 * index.html-də <script src="https://accounts.google.com/gsi/client"> artıq var,
 * amma `async defer` ilə yükləndiyi üçün DOM-content-loaded anında hazır olmaya bilər —
 * bu, hazır olana qədər gözləyir.
 */
function waitForGoogleScript() {
    if (window.google?.accounts?.id) {
        return Promise.resolve();
    }
    if (scriptLoadPromise) {
        return scriptLoadPromise;
    }
    scriptLoadPromise = new Promise((resolve, reject) => {
        const start = Date.now();
        const TIMEOUT_MS = 10_000;
        const check = () => {
            if (window.google?.accounts?.id) {
                resolve();
                return;
            }
            if (Date.now() - start > TIMEOUT_MS) {
                reject(new Error("Google Identity Services skripti yüklənmədi"));
                return;
            }
            window.setTimeout(check, 100);
        };
        check();
    });
    return scriptLoadPromise;
}
/**
 * Öz dizaynımızda olan "Google ilə davam et" düyməsinin arxasında REAL Google
 * axınını işlədir. Google-ın öz düyməsini görünməz bir div-də render edirik və
 * bizim düyməmiz basılanda ona click event-i ötürürük — beləliklə həm öz UI-mızı
 * saxlayırıq, həm də Google-ın etibarlı popup/One-Tap məntiqini istifadə edirik
 * (yalnız `google.accounts.id.prompt()` çağırmaq bloklanma/cooldown səbəbindən
 * etibarsızdır).
 */
export function useGoogleSignIn(onIdToken) {
    const hiddenButtonRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const onIdTokenRef = useRef(onIdToken);
    onIdTokenRef.current = onIdToken;
    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) {
            return;
        }
        let cancelled = false;
        waitForGoogleScript()
            .then(() => {
            if (cancelled || !window.google || !hiddenButtonRef.current)
                return;
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: (response) => onIdTokenRef.current(response.credential),
                cancel_on_tap_outside: true,
            });
            window.google.accounts.id.renderButton(hiddenButtonRef.current, {
                type: "standard",
                theme: "outline",
                size: "large",
            });
            setIsReady(true);
        })
            .catch((err) => {
            if (!cancelled)
                setLoadError(err.message);
        });
        return () => {
            cancelled = true;
        };
    }, []);
    const triggerSignIn = useCallback(() => {
        // Google-ın öz render etdiyi düymənin daxilindəki click-lənə bilən elementi tapıb
        // proqramla basırıq.
        const realButton = hiddenButtonRef.current?.querySelector("div[role=button]");
        realButton?.click();
    }, []);
    return { hiddenButtonRef, isReady, loadError, triggerSignIn };
}
