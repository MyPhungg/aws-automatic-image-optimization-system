import "./RecentProcessing.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecentItem from "./RecentItem";
import { dashBoardService } from "../../../services/dashBoardService";
import type { ProcessingHistory } from "../../../types/ProcessingHistory";

function formatFileSize(size?: number) {
    if (!size) return "-";
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function RecentProcessing() {
    const navigate = useNavigate();
    const [items, setItems] = useState<ProcessingHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const res = await dashBoardService.getMyHistory();
                const history = res.data || [];
                // take latest 5
                const recent = history.slice(0, 5);

                const batches = await Promise.all(
                    recent.map(async (h: any) => {
                        try {
                            const b = await dashBoardService.getBatch(h.batchId);
                            return { history: h, batch: b.data };
                        } catch (err) {
                            console.error("Failed to load batch", h.batchId, err);
                            return { history: h, batch: null };
                        }
                    })
                );

                const mapped = batches.map(({ history, batch }) => {
                    const image = batch?.images?.[0];
                    const status = history.failedImages && history.failedImages > 0
                        ? "Failed"
                        : history.successImages < history.totalImages
                            ? "Processing"
                            : "Completed";

                    const preview = image?.thumbnailUrl ?? image?.downloadUrl ?? "";

                    const ph: ProcessingHistory = {
                        id: history.batchId,
                        thumbnail: preview || `https://picsum.photos/60?${history.batchId}`,
                        fileName: image?.originalName ?? `Batch ${history.batchId}`,
                        originalSize: formatFileSize(image?.originalSize),
                        optimizedSize: formatFileSize(image?.processedSize),
                        preset: image?.format ?? "Balanced",
                        status: status as any,
                        uploadTime: history.uploadedAt,
                    };

                    return ph;
                });

                if (mounted) setItems(mapped);
            } catch (err) {
                console.error(err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => { mounted = false; };
    }, []);

    return (
        <section className="recent-processing">
            <div className="recent-header">
                <h2>Recent Processing</h2>
                <button onClick={() => navigate("/history")}>View All</button>
            </div>

            <div className="recent-list">
                {loading ? (
                    <div className="recent-empty">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="recent-empty">No recent processing items</div>
                ) : (
                    items.map(item => (
                        <RecentItem key={item.id} item={item} />
                    ))
                )}
            </div>
        </section>
    );
}

export default RecentProcessing;