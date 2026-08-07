import "./SummaryCards.css";

import { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import { dashBoardService } from "../../../services/dashBoardService";

function formatBytes(bytes: number) {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

function SummaryCards() {
    const [stats, setStats] = useState({
        totalImages: 0,
        storageSaved: 0,
        avgCompression: 0,
        successRate: 0,
    });

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await dashBoardService.getMyHistory();
                const history = res.data || [];
                if (!mounted) return;

                let totalImages = 0;
                let successImages = 0;
                let totalSavedBytes = 0;
                let totalCompressionRatios = 0;
                let compressionCount = 0;

                await Promise.all(
                    history.map(async (h: any) => {
                        try {
                            const batchRes = await dashBoardService.getBatch(h.batchId);
                            const images = batchRes.data?.images ?? [];
                            images.forEach((img: any) => {
                                totalImages++;
                                if (img.status === "SUCCESS") {
                                    successImages++;
                                    if (img.originalSize && img.processedSize) {
                                        totalSavedBytes += (img.originalSize - img.processedSize);
                                    }
                                    if (img.compressionRatio) {
                                        totalCompressionRatios += img.compressionRatio;
                                        compressionCount++;
                                    }
                                }
                            });
                        } catch (err) {
                            // skip failed batches
                        }
                    })
                );

                if (mounted) {
                    setStats({
                        totalImages,
                        storageSaved: totalSavedBytes,
                        avgCompression: compressionCount > 0 ? Math.round(totalCompressionRatios / compressionCount) : 0,
                        successRate: totalImages > 0 ? Math.round((successImages / totalImages) * 100) : 0,
                    });
                }
            } catch (err) {
                console.error("Failed to load summary stats", err);
            }
        };

        load();
        return () => { mounted = false; };
    }, []);

    const cards = [
        {
            title: "Total Images",
            value: String(stats.totalImages),
            subtitle: "All time",
        },
        {
            title: "Storage Saved",
            value: formatBytes(stats.storageSaved),
            subtitle: "Total saved",
        },
        {
            title: "Avg Compression",
            value: `${stats.avgCompression}%`,
            subtitle: stats.avgCompression >= 50 ? "Excellent" : "Good",
        },
        {
            title: "Success Rate",
            value: `${stats.successRate}%`,
            subtitle: stats.successRate >= 95 ? "Stable" : "Check logs",
        },
    ];

    return (
        <div className="summary-grid">
            {cards.map((card) => (
                <SummaryCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    subtitle={card.subtitle}
                />
            ))}
        </div>
    );
}

export default SummaryCards;