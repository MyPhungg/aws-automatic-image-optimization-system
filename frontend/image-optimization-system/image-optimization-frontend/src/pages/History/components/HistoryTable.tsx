import "./HistoryTable.css";

import { useEffect, useState } from "react";
import HistoryRow from "./HistoryRow";
import { dashBoardService, type HistoryResponse } from "../../../services/dashBoardService";

interface Props {
    currentPage: number;
    pageSize: number;
    onTotalItemsChange?: (total: number) => void;
}

function HistoryTable({ currentPage, pageSize, onTotalItemsChange }: Props){

    const [history, setHistory] = useState<HistoryResponse[]>([]);
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
                setHistory(data);
                if (onTotalItemsChange) {
                    onTotalItemsChange(data.length);
                }
            } catch (err: any) {
                console.error(err);
                setError(err?.message ?? "Failed to load history");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [onTotalItemsChange]);

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = history.slice(start, end);

    return(
        <div className="history-table-wrapper">
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Batch ID</th>
                        <th>Uploaded At</th>
                        <th>Preset</th>
                        <th>Total</th>
                        <th>Success</th>
                        <th>Failed</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={7}>Loading...</td></tr>
                    ) : error ? (
                        <tr><td colSpan={7} style={{color:'red'}}>{error}</td></tr>
                    ) : pageItems.length === 0 ? (
                        <tr><td colSpan={7}>No history found.</td></tr>
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