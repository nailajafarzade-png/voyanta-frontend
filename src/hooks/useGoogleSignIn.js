import { useEffect, useRef, useState } from "react";

export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let scriptLoadPromise = null;

function waitForGoogleScript() {
    if (window.google?.accounts?.id) return Promise.resolve();
    if (scriptLoadPromise) return scriptLoadPromise;

    scriptLoadPromise = new Promise((resolve, reject) => {
        const start = Date.now();
        const check = () => {
            if (window.google?.accounts?.id) { resolve(); return; }
            if (Date.now() - start > 10_000) { reject(new Error("GSI yüklənmədi")); return; }
            window.setTimeout(check, 100);
        };
        check();
    });
    return scriptLoadPromise;
}

export function useGoogleSignIn(onIdToken) {
    const buttonRef = useRef(null);       // Google öz button-unu bura render edir
    const [isReady, setIsReady] = useState(false);
    const [loadError, setLoadError] = useState(null);
    const onIdTokenRef = useRef(onIdToken);
    onIdTokenRef.current = onIdToken;

    useEffect(() => {
        if (!GOOGLE_CLIENT_ID) return;
        let cancelled = false;

        waitForGoogleScript()
            .then(() => {
                if (cancelled || !buttonRef.current) return;

                window.google.accounts.id.initialize({
                    client_id: GOOGLE_CLIENT_ID,
                    callback: (response) => onIdTokenRef.current(response.credential),
                    use_fedcm_for_prompt: true,
                });

                window.google.accounts.id.renderButton(buttonRef.current, {
                    type: "standard",
                    theme: "outline",
                    size: "large",
                    shape: "rectangular",
                    width: buttonRef.current.offsetWidth || 320,
                    logo_alignment: "left",
                });

                setIsReady(true);
            })
            .catch((err) => { if (!cancelled) setLoadError(err.message); });

        return () => {
            cancelled = true;
            window.google?.accounts?.id?.cancel();
        };
    }, []);

    return { buttonRef, isReady, loadError };
}