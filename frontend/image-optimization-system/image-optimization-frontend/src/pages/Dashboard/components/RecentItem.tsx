import "./RecentItem.css";

import type { ProcessingHistory } from "../../../types/ProcessingHistory";

interface RecentItemProps {
    item: ProcessingHistory;
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

            <div
                className={`recent-status ${item.status.toLowerCase()}`}
            >

                {item.status}

            </div>

            <div className="recent-time">

                {item.uploadTime}

            </div>

        </div>

    );

}

export default RecentItem;