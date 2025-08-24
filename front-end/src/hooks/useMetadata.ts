import { useContext } from "react";

import { MetadataContext } from "../contexts/MetadataContext";

export const useMetadata = () => {
    const context = useContext(MetadataContext);
    if (!context) {
        throw new Error("useMetadata must be inside of MetadataProvider");
    }
    return context;
}