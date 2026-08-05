import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { HistoryResponse } from "../../../services/dashBoardService";
import { dashBoardService } from "../../../services/dashBoardService";
import "./HistoryRow.css";

interface Props{
    item: HistoryResponse | any;
}

function HistoryRow({item}:Props){

    const [loading, setLoading] = useState(false);
    const [batchData, setBatchData] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [preset, setPreset] = useState<string>("-");

    const getPresetName = (quality?: number) => {
        if (!quality) return "-";
        if (quality >= 95) return "High Quality";
        if (quality >= 80) return "Balanced";
        if (quality >= 60) return "Save Space";
        return "Custom";
    };

    useEffect(() => {
        let mounted = true;
        dashBoardService.getBatch(item.batchId).then((res) => {
            if (mounted && res.data) {
                setBatchData(res.data);
                const firstImg = res.data.images?.[0];
                if (firstImg?.quality) {
                    setPreset(getPresetName(firstImg.quality));
                }
            }
        }).catch((err) => console.error("Failed to fetch batch format", err));
        return () => { mounted = false; };
    }, [item.batchId]);

    const handleView = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const formatSize = (size?: number) => {
        if (!size) return "-";
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
        return `${(size / 1024 / 1024).toFixed(2)} MB`;
    };

    const firstSuccessImage = batchData?.images?.find((img: any) => img.status === 'SUCCESS' && img.downloadUrl);

    return(
        <>
            <tr>
                <td>{item.batchId}</td>
                <td>{new Date(item.uploadedAt).toLocaleString()}</td>
                <td style={{ fontWeight: "600", color: "#4B5563" }}>{preset}</td>
                <td>{item.totalImages}</td>
                <td>{item.successImages}</td>
                <td>{item.failedImages}</td>
                <td>
                    <button onClick={handleView} disabled={loading}>
                        View
                    </button>
                </td>
            </tr>

            {showModal && createPortal(
                <div className="history-modal-overlay" onClick={closeModal}>
                    <div className="history-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="history-modal-header">
                            <h2>Batch Details</h2>
                            <div className="history-batch-meta">
                                <span><strong>ID:</strong> {item.batchId}</span>
                                <span>•</span>
                                <span><strong>Uploaded:</strong> {new Date(item.uploadedAt).toLocaleString()}</span>
                            </div>
                        </div>
                        
                        <div className="history-modal-body">
                            <div className="history-modal-images">
                                {batchData?.images?.map((img: any) => (
                                    <div key={img.processingId} className="history-modal-image-card">
                                        <div className="history-modal-image-info">
                                            {img.thumbnailUrl && <img src={img.thumbnailUrl} alt={img.originalName} className="history-thumbnail" />}
                                            <div className="history-image-details">
                                                <h4>{img.originalName}</h4>
                                                <div className="history-image-meta-grid">
                                                    <p><strong>Status:</strong> <span className={`status ${img.status?.toLowerCase()}`}>{img.status}</span></p>
                                                    <p><strong>Format:</strong> {img.format}</p>
                                                    {img.status === 'SUCCESS' && (
                                                        <>
                                                            <p><strong>Original:</strong> {formatSize(img.originalSize)}</p>
                                                            <p><strong>Optimized:</strong> {formatSize(img.processedSize)}</p>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="history-modal-footer">
                            <button className="history-btn history-btn-secondary" onClick={closeModal}>
                                Close
                            </button>
                            {firstSuccessImage && (
                                <a 
                                    href={firstSuccessImage.downloadUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="history-btn history-btn-primary"
                                >
                                    Download
                                </a>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}

export default HistoryRow;