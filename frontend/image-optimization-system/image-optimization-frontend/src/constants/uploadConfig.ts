// ============================================
// Upload Configuration
// ============================================

export const UPLOAD_CONFIG = {

    /**
     * Maximum number of images
     */
    MAX_IMAGE_COUNT: 100,

    /**
     * Maximum size per image (20 MB)
     */
    MAX_FILE_SIZE:

        20 * 1024 * 1024,

    /**
     * Maximum total upload size (100 MB)
     */
    MAX_TOTAL_SIZE:

        100 * 1024 * 1024,

    /**
     * Minimum image dimensions
     */
    MIN_WIDTH: 256,

    MIN_HEIGHT: 256,

    /**
     * Maximum image dimensions
     */
    MAX_WIDTH: 8000,

    MAX_HEIGHT: 8000,

    /**
     * Maximum total pixels per image to avoid Lambda overload
     */
    MAX_TOTAL_PIXELS:

        50 * 1000 * 1000,

    /**
     * Aspect ratio limits
     */
    MAX_ASPECT_RATIO: 5,

    MIN_ASPECT_RATIO: 0.2,

    /**
     * Supported image formats
     */
    SUPPORTED_FORMATS: [

        "image/jpeg",

        "image/png",

        "image/webp"

    ]

};