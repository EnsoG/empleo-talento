import { useEffect } from "react";

declare global {
    interface Window {
        FB: any;
        fbAsyncInit: () => void;
    }
}

export const useFacebookSDK = (appId: string) => {
    useEffect(() => {
        window.fbAsyncInit = function () {
            window.FB.init({
                appId,
                cookie: true,
                xfbml: false,
                version: "v18.0",
            });
        }
    }, [appId]);
}