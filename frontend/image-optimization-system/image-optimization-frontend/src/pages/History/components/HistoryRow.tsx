import { useState, useEffect } from "react";
import type { HistoryResponse } from "../../../services/dashBoardService";
import { dashBoardService } from "../../../services/dashBoardService";
import "./HistoryRow.css";

interface Props {
    item: HistoryResponse | any;
}

function getPresetName(quality?: number) {
    if (!quality) return "Balanced";
    if (quality >= 95) return "High Quality";
    if (quality >= 80) return "Balanced";
    return "Storage Saver";
}

function formatSize(size?: number) {
    if (!size) return "-";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function HistoryRow({ item }: Props) {
    const [loading, setLoading] = useState(false);
    const [batchData, setBatchData] = useState<any>(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        dashBoardService.getBatch(item.batchId)
            .then((res) => {
                if (mounted && res.data) {
                    setBatchData(res.data);
                }
            })
            .catch((err) => console.error("Failed to fetch batch details", err))
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, [item.batchId]);

    const handleDownloadBatch = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            const response = await (await import("../../../services/imageService")).imageService.downloadBatch(item.batchId);
            const blob = response.data as Blob;
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = `batch-${item.batchId}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (err) {
            console.error("Download failed", err);
        }
    };

    return (
        <>
            <tr 
                className={`batch-row ${expanded ? 'expanded' : ''}`}
                onClick={() => setExpanded(!expanded)}
            >
                <td>
                    <div className="batch-id-cell">
                        <span className={`expand-icon ${expanded ? 'rotated' : ''}`}>▶</span>
                        <span>{item.batchId}</span>
                    </div>
                </td>
                <td>{new Date(item.uploadedAt).toLocaleString()}</td>
                <td>{item.totalImages}</td>
                <td><span className="badge success">{item.successImages}</span></td>
                <td><span className="badge failed">{item.failedImages}</span></td>
                <td>
                    <button 
                        className="expand-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            setExpanded(!expanded);
                        }}
                    >
                        {expanded ? "Hide Details" : "View Details"}
                    </button>
                </td>
            </tr>

            {expanded && (
                <tr className="details-row">
                    <td colSpan={6}>
                        <div className="details-container">
                            <div className="details-header">
                                <h4>Batch Details ({item.totalImages} {item.totalImages === 1 ? 'image' : 'images'})</h4>
                                {batchData?.images?.some((img: any) => img.status === 'SUCCESS') && (
                                    <button className="download-batch-btn" onClick={handleDownloadBatch}>
                                        Download Batch ZIP
                                    </button>
                                )}
                            </div>

                            {loading ? (
                                <div style={{ padding: '16px', color: '#6b7280' }}>Loading image details...</div>
                            ) : !batchData?.images || batchData.images.length === 0 ? (
                                <div style={{ padding: '16px', color: '#6b7280' }}>No images found in this batch.</div>
                            ) : (
                                <div className="image-details-grid">
                                    {batchData.images.map((img: any) => {
                                        const savings = (img.originalSize && img.processedSize && img.originalSize > img.processedSize)
                                            ? Math.round(((img.originalSize - img.processedSize) / img.originalSize) * 100)
                                            : 0;

                                        return (
                                            <div key={img.processingId || img.originalName} className="image-detail-card">
                                                <div className="image-detail-left">
                                                    {img.thumbnailUrl ? (
                                                        <img src={img.thumbnailUrl} alt={img.originalName} className="image-thumb" />
                                                    ) : (
                                                        <div className="image-thumb-placeholder">🖼️</div>
                                                    )}
                                                    <div className="image-info">
                                                        <h5 className="image-filename">{img.originalName}</h5>
                                                        <div className="image-tags">
                                                            <span className={`status ${img.status?.toLowerCase()}`}>{img.status}</span>
                                                            <span className="preset-tag">{getPresetName(img.quality)} ({img.format || 'PNG'})</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="image-detail-right">
                                                    {img.status === 'SUCCESS' && (
                                                        <div className="image-sizes">
                                                            <span>Original: <strong>{formatSize(img.originalSize)}</strong></span>
                                                            <span className="size-arrow">➔</span>
                                                            <span>Optimized: <strong>{formatSize(img.processedSize)}</strong></span>
                                                            {savings > 0 && (
                                                                <span className="savings-badge">-{savings}%</span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {img.downloadUrl && (
                                                        <a 
                                                            href={img.downloadUrl} 
                                                            download={img.originalName}
                                                            className="download-img-btn"
                                                            onClick={(e) => e.stopPropagation()}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Download
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export default HistoryRow;
