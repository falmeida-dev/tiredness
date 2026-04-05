import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

export const useWarmUpBrowser = () => {
    React.useEffect(() => {
        // Pre-warm the browser on Android for better performance
        if (Platform.OS === "android") {
            void WebBrowser.warmUpAsync();
        }
        return () => {
            if (Platform.OS === "android") {
                void WebBrowser.coolDownAsync();
            }
        };
    }, []);
};
