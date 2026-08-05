import "./StatusBadge.css";

interface StatusBadgeProps {

    status:
        | "PENDING"
        | "UPLOADING"
        | "PROCESSING"
        | "SUCCESS"
        | "FAILED";

}

function StatusBadge({ status }: StatusBadgeProps) {

    const getLabel = () => {

        switch (status) {

            case "PENDING":
                return "Pending";

            case "UPLOADING":
                return "Uploading";

            case "PROCESSING":
                return "Processing";

            case "SUCCESS":
                return "Success";

            case "FAILED":
                return "Failed";

            default:
                return status;
        }

    };

    return (

        <span className={`status-badge ${status.toLowerCase()}`}>

            {getLabel()}

        </span>

    );

}

export default StatusBadge;