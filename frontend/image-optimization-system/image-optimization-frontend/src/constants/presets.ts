// ======================================================
// Compression Presets
// ======================================================

import type { CompressionPreset } from "../types/ImageItem";

export interface Preset {

    id: CompressionPreset;

    title: string;

    description: string;

    quality: number;

    estimatedSaving: string;

}

export const PRESETS: Preset[] = [

    {

        id: "BALANCED",

        title: "Balanced",

        description:
            "Balance between image quality and file size. Recommended for most users.",

        quality: 80,

        estimatedSaving: "40% - 60%"

    },

    {

        id: "HIGH_QUALITY",

        title: "High Quality",

        description:
            "Keep maximum visual quality with minimal compression.",

        quality: 95,

        estimatedSaving: "10% - 30%"

    },

    {

        id: "SAVE_SPACE",

        title: "Save Space",

        description:
            "Reduce storage usage as much as possible while keeping acceptable quality.",

        quality: 60,

        estimatedSaving: "60% - 80%"

    }

];