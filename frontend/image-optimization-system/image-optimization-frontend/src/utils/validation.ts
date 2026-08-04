import type { Imageitem } from "../types/ImageItem";
import type { CompressionPreset } from "../types/ImageItem";
import type { CompressionModeType } from "../pages/upload/components/compressionMode/CompressionMode";
import type { ValidationResult } from "../types/Validation";
import { UPLOAD_CONFIG } from "../constants/uploadConfig";

function formatMb(value: number) {
    return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function getPresetWarning(image: Imageitem, preset: CompressionPreset): string | null {
    const isSmall = image.totalPixels < 2_000_000;
    const isLarge = image.totalPixels > 20_000_000;

    if (preset === "SAVE_SPACE" && isSmall) {
        return `Image ${image.name} is small (${image.width}x${image.height}) but uses the SAVE_SPACE preset. This may reduce quality excessively.`;
    }

    if (preset === "HIGH_QUALITY" && isLarge) {
        return `Image ${image.name} is large (${image.width}x${image.height}) and may take longer to process with HIGH_QUALITY.`;
    }

    return null;
}

export function validateImages(
    images: Imageitem[],
    mode: CompressionModeType,
    preset: CompressionPreset
): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (images.length === 0) {
        errors.push("No images selected for upload.");
    }

    if (images.length > UPLOAD_CONFIG.MAX_IMAGE_COUNT) {
        errors.push(`You can upload a maximum of ${UPLOAD_CONFIG.MAX_IMAGE_COUNT} images.`);
    }

    const totalSize = images.reduce((acc, image) => acc + image.size, 0);
    if (totalSize > UPLOAD_CONFIG.MAX_TOTAL_SIZE) {
        errors.push(`Total upload size exceeds the maximum limit of ${formatMb(UPLOAD_CONFIG.MAX_TOTAL_SIZE)}.`);
    }

    const nameCounts = new Map<string, number>();
    const hashCounts = new Map<string, number>();
    images.forEach((image) => {
        nameCounts.set(image.name, (nameCounts.get(image.name) || 0) + 1);
        if (image.hash) {
            hashCounts.set(image.hash, (hashCounts.get(image.hash) || 0) + 1);
        }
    });

    for (const [name, count] of nameCounts) {
        if (count > 1) {
            errors.push(`Duplicate file name detected: ${name}`);
        }
    }

    for (const [hash, count] of hashCounts) {
        if (count > 1) {
            const duplicates = images.filter((image) => image.hash === hash).map((image) => image.name).join(", ");
            errors.push(`Duplicate image content detected for files: ${duplicates}`);
        }
    }

    images.forEach((image) => {
        if (!UPLOAD_CONFIG.SUPPORTED_FORMATS.includes(image.type)) {
            errors.push(`Unsupported file format: ${image.name}`);
        }

        if (image.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
            errors.push(`File size of ${image.name} exceeds the maximum limit of ${formatMb(UPLOAD_CONFIG.MAX_FILE_SIZE)}.`);
        }

        if (image.width == null || image.height == null || !image.hash) {
            errors.push(`Missing image metadata for ${image.name}. Please re-upload the file.`);
            return;
        }

        if (image.width < UPLOAD_CONFIG.MIN_WIDTH || image.height < UPLOAD_CONFIG.MIN_HEIGHT) {
            errors.push(`Image ${image.name} dimensions are too small. Minimum size is ${UPLOAD_CONFIG.MIN_WIDTH}x${UPLOAD_CONFIG.MIN_HEIGHT}.`);
        }

        if (image.width > UPLOAD_CONFIG.MAX_WIDTH || image.height > UPLOAD_CONFIG.MAX_HEIGHT) {
            errors.push(`Image ${image.name} dimensions are too large. Maximum size is ${UPLOAD_CONFIG.MAX_WIDTH}x${UPLOAD_CONFIG.MAX_HEIGHT}.`);
        }

        const aspectRatio = image.width / image.height;
        if (aspectRatio > UPLOAD_CONFIG.MAX_ASPECT_RATIO || aspectRatio < UPLOAD_CONFIG.MIN_ASPECT_RATIO) {
            errors.push(`Image ${image.name} has an extreme aspect ratio (${image.width}x${image.height}).`);
        }

        if (image.totalPixels > UPLOAD_CONFIG.MAX_TOTAL_PIXELS) {
            errors.push(`Image ${image.name} exceeds the maximum allowed total pixels (${UPLOAD_CONFIG.MAX_TOTAL_PIXELS.toLocaleString()}).`);
        }

        if (mode === "CUSTOM" && !image.preset) {
            errors.push(`No compression preset selected for ${image.name}.`);
        }

        const effectivePreset = mode === "GLOBAL" ? preset : image.preset;
        const presetWarning = getPresetWarning(image, effectivePreset);
        if (presetWarning) {
            warnings.push(presetWarning);
        }
    });

    return { valid: errors.length === 0, errors, warnings };
}

