import "./ImageCard.css";
import { PRESETS } from "../../../../constants/presets";
import { type Imageitem } from "../../../../types/ImageItem";
import type { CompressionModeType } from "../compressionMode/CompressionMode";
import ProgressBar from "../ProgressBar/ProgressBar";
import type { CompressionPreset } from "../../../../types/ImageItem";
interface ImageCardProps {

    image: Imageitem;

    mode: CompressionModeType;

    onRemove:(id:string)=>void;

    onPresetChange:(

        id:string,

        preset:CompressionPreset

    )=>void;

}
function formatFileSize(size: number): string {

    if (size < 1024) {

        return `${size} B`;

    }

    if (size < 1024 * 1024) {

        return `${(size / 1024).toFixed(2)} KB`;

    }

    return `${(size / 1024 / 1024).toFixed(2)} MB`;

}

function ImageCard({

    image,

    mode,

    onRemove,

    onPresetChange

}: ImageCardProps) {

    return (

        <div className="image-card">

            {/* Thumbnail */}

            <img

                src={image.previewUrl}

                alt={image.name}

                className="image-thumbnail"

            />

            {/* Information */}

            <div className="image-info">

                <h3>{image.name}</h3>

                <p>

                    <strong>Size:</strong> {formatFileSize(image.size)}

                </p>

                <p>

                    <strong>Type:</strong> {image.type}

                </p>

                <p>

                    <strong>Status:</strong> {image.status}

                </p>
                {mode === "CUSTOM" && (
                    <div className="preset-section">
                        <label>Optimization Preset</label>
                        <select
                            value={image.preset}
                            onChange={(event) =>
                                onPresetChange(
                                    image.id,
                                    event.target.value as CompressionPreset
                                )
                            }
                        >
                            {PRESETS.map((preset) => (
                                <option key={preset.id} value={preset.id}>
                                    {preset.title}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <ProgressBar value={image.progress} />
            </div>

            {/* Footer */}

            <div className="image-actions">

                <button

                    className="remove-button"

                    onClick={() => onRemove(image.id)}

                >

                    Remove

                </button>

            </div>

        </div>

    );

}

export default ImageCard;