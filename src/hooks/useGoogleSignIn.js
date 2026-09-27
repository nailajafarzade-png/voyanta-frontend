import { useCallback, useEffect, useRef, useState } from "react";

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let scriptLoadPromise = null;

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

export function useGoogleSignIn(onIdToken) {
    const [isReady, setIsReady] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const onIdTokenRef = useRef(onIdToken);
    onIdTokenRef.current = onIdToken;

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;

        let cancelled = false;

        waitForGoogleScript()
            .then(() => {
                if (cancelled) return;

                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (response) => {
                        // response.credential — ID token (JWT), backend gözlədiyi formatdır
                        onIdTokenRef.current(response.credential);
                    },
                    cancel_on_tap_outside: true,
                });

                setIsReady(true);
            })
            .catch((err) => {
                if (!cancelled) setLoadError(err.message);
            });

        return () => {
            cancelled = true;
            // Komponentin unmount-da One Tap UI-ni bağla
            window.google?.accounts?.id?.cancel();
        };
    }, []);

    const triggerSignIn = useCallback(() => {
        if (!window.google?.accounts?.id) return;

        // prompt() — user click-i ilə çağırılanda browser bloklamır
        // momentNotificationDisplayed callback ilə niyə göstərilmədiyini görə bilərik
        window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
                console.warn("Google prompt göstərilmədi:", notification.getNotDisplayedReason());
            }
            if (notification.isSkippedMoment()) {
                console.warn("Google prompt skip edildi:", notification.getSkippedReason());
            }
        });
    }, []);

    // hiddenButtonRef — artıq istifadə edilmir, amma API uyğunluğu üçün saxlayırıq
    const hiddenButtonRef = useRef(null);

    return { hiddenButtonRef, isReady, loadError, triggerSignIn };
}