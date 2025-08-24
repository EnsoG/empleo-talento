import { createContext } from "react";

import { Metadata } from "../types";

interface MetadataContextType {
    metadata: Metadata
}

export const MetadataContext = createContext<MetadataContextType | undefined>(undefined);