import "./RecentItem.css";

import type { ProcessingHistory } from "../../../types/ProcessingHistory";

interface RecentItemProps {
    item: ProcessingHistory;
}

function formatDate(dateStr?: string) {
    if (!dateStr) return "-";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    } catch {
        return dateStr;
    }
}

function RecentItem({ item }: RecentItemProps) {
    return (
        <div className="recent-item">
            <div className="recent-image">
                <img
                    src={item.thumbnail}
                    alt={item.fileName}
                />
            </div>

            <div className="recent-info">
                <h4>{item.fileName}</h4>
                <p>{item.originalSize}</p>
            </div>

            <div className="recent-preset">
                {item.preset}
            </div>

            <div className={`recent-status ${item.status.toLowerCase()}`}>
                {item.status}
            </div>

            <div className="recent-time">
                {formatDate(item.uploadTime)}
            </div>
        </div>
    );
}

export default RecentItem;