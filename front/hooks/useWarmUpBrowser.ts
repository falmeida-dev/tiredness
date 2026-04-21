import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Platform } from "react-native";

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        // Pre-warm the browser on Android for better performance
        if (Platform.OS === "android") {
            void WebBrowser.warmUpAsync().catch((err) => {
                console.error("Erro ao carregar o navegador: ", err);
            });
        }
        return () => {
            if (Platform.OS === "android") {
                void WebBrowser.coolDownAsync().catch((err) => {
                    console.error("Erro ao descarregar o navegador: ", err);
                });
            }
        };
    }, []);
};
