import "./HistoryTable.css";

import { useEffect, useState, useMemo } from "react";
import HistoryRow from "./HistoryRow";
import { dashBoardService, type HistoryResponse } from "../../../services/dashBoardService";

interface Props {
    search: string;
    status: string;
    preset: string;
    currentPage: number;
    pageSize: number;
    onTotalItemsChange?: (total: number) => void;
}

interface EnrichedHistory extends HistoryResponse {
    images?: any[];
    computedPreset?: string;
    computedStatus?: string;
}

export function getPresetName(quality?: number) {
    if (!quality) return "Balanced";
    if (quality >= 95) return "High Quality";
    if (quality >= 80) return "Balanced";
    return "Storage Saver";
}

function HistoryTable({ search, status, preset, currentPage, pageSize, onTotalItemsChange }: Props) {
    const [rawHistory, setRawHistory] = useState<EnrichedHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                const res = await dashBoardService.getMyHistory();
                if (!mounted) return;
                const data = res.data || [];
                // Sort by newest upload time
                data.sort((a: HistoryResponse, b: HistoryResponse) => 
                    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                );

                const enriched: EnrichedHistory[] = await Promise.all(
                    data.map(async (item: HistoryResponse) => {
                        let images: any[] = [];
                        let computedPreset = "Balanced";
                        try {
                            const bRes = await dashBoardService.getBatch(item.batchId);
                            images = bRes.data?.images || [];
                            const firstImg = images[0];
                            if (firstImg?.quality) {
                                computedPreset = getPresetName(firstImg.quality);
                            }
                        } catch (e) {
                            // ignore batch fetch errors
                        }

                        let computedStatus = "Completed";
                        if (item.failedImages > 0) {
                            computedStatus = "Failed";
                        } else if (item.successImages < item.totalImages) {
                            computedStatus = "Processing";
                        }

                        return {
                            ...item,
                            images,
                            computedPreset,
                            computedStatus,
                        };
                    })
                );

                if (mounted) {
                    setRawHistory(enriched);
                }
            } catch (err: any) {
                console.error(err);
                if (mounted) setError(err?.message ?? "Failed to load history");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    const filteredHistory = useMemo(() => {
        return rawHistory.filter(item => {
            // Search filter
            if (search.trim()) {
                const query = search.trim().toLowerCase();
                const matchBatchId = item.batchId.toLowerCase().includes(query);
                const matchImageName = item.images?.some(img => 
                    img.originalName?.toLowerCase().includes(query)
                );
                if (!matchBatchId && !matchImageName) {
                    return false;
                }
            }

            // Status filter
            if (status !== "ALL") {
                if (item.computedStatus !== status) {
                    return false;
                }
            }

            // Preset filter
            if (preset !== "ALL") {
                if (item.computedPreset !== preset && item.computedPreset !== (preset === "Storage Saver" ? "Save Space" : preset)) {
                    return false;
                }
            }

            return true;
        });
    }, [rawHistory, search, status, preset]);

    useEffect(() => {
        if (onTotalItemsChange) {
            onTotalItemsChange(filteredHistory.length);
        }
    }, [filteredHistory.length, onTotalItemsChange]);

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = filteredHistory.slice(start, end);

    return (
        <div className="history-table-wrapper">
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Batch ID</th>
                        <th>Uploaded At</th>
                        <th>Total</th>
                        <th>Success</th>
                        <th>Failed</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={6}>Loading...</td></tr>
                    ) : error ? (
                        <tr><td colSpan={6} style={{ color: 'red' }}>{error}</td></tr>
                    ) : pageItems.length === 0 ? (
                        <tr><td colSpan={6}>No history found.</td></tr>
                    ) : (
                        pageItems.map(item => (
                            <HistoryRow key={item.batchId} item={item} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default HistoryTable;