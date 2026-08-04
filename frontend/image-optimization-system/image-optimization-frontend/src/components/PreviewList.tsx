import "./PreviewList.css";
import type { Imageitem } from "../types/ImageItem";

interface PreviewListProps {
    images: Imageitem[];
    onRemove: (id: string) => void;
}

function formatFileSize(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function PreviewList({ images, onRemove }: PreviewListProps) {
    if (!images || images.length === 0) {
        return (
            <div className="empty-preview">
                <h3>No Images Selected</h3>
                <p>Upload one or multiple images to preview them here.</p>
            </div>
        );
    }

    return (
        <div className="preview-list">
            {images.map((image) => (
                <div className="preview-card" key={image.id}>
                    <img src={image.previewUrl} alt={image.name} />

                    <div className="preview-info">
                        <h3>{image.name}</h3>
                        <p>Size: {formatFileSize(image.size)}</p>
                        <p>Type: {image.type}</p>
                        <p>Status: {image.status}</p>
                    </div>

                    <button className="remove-button" onClick={() => onRemove(image.id)}>
                        Remove
                    </button>
                </div>
            ))}
        </div>
    );
}

export default PreviewList;
