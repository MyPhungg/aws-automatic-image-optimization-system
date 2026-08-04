import "./ImageCard.css";
import { PRESETS } from "../../../../constants/presets";
import { type Imageitem } from "../../../../types/ImageItem";
import type { CompressionModeType } from "../compressionMode/CompressionMode";
import ProgressBar from "../ProgressBar/ProgressBar";
import type { CompressionPreset } from "../../../../types/ImageItem";
import StatusBadge from "../StatusBadge/StatusBadge";
import { imageService } from "../../../../services/imageService";
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

                <div className="status-section">

                    <p>

                        <strong>Status</strong>

                    </p>

                    <StatusBadge

                        status={image.status}

                    />

                </div>
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
            {
                image.result && 
                <div className="result-panel">
                    <div className="result-item">
                        <span>
                            Original Size: 
                        </span>
                        <strong>
                            {formatFileSize(image.result.originalSize || 0)}
                        </strong>
                    </div>
                    <div className="result-item">
                        <span>
                            Optimized Size: 
                        </span>
                        <strong>
                            {formatFileSize(image.result.optimizedSize || 0)}
                        </strong>
                    </div>
                    <div className="result-item">
                        <span>
                            Compression:  
                        </span>
                        <strong>
                            {formatFileSize(image.result.compressionRatio || 0)} %
                        </strong>
                    </div>
                    <div className="result-item">
                        <span>
                            Processing Time: 
                        </span>
                        <strong>
                            {formatFileSize(image.result.processingTimeMs || 0)} ms
                        </strong>
                    </div>
                </div>
            }
            {
                image.status === "SUCCESS" && 
                <div className="action-group">
                    <button className="preview-btn" onClick={() => {window.open(image.result?.outputUrl, "_blank")}}>Preview</button>
                    <button className="download-btn"
                    onClick={() => {
                        const download = async(id:string)=>{

                        const response = await imageService.downloadImage(id);

                        const url = window.URL.createObjectURL(response.data);

                        const a=document.createElement("a");

                        a.href=url;

                        a.download="image.jpg";

                        a.click();

                    }
                    }}>
                        Download
                    </button>
                    <button className="copy-btn"
                    onClick={() => {
                        navigator.clipboard.writeText(image.result?.outputUrl??"")
                    }}>Copy Link</button>
                </div>
            }
            {
            image.status==="FAILED"
            &&
            <div className="failed-group">
            <button>
            Retry
            </button>
            </div>
            }
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