import "./HistoryHeader.css";

import { useNavigate } from "react-router-dom";

function HistoryHeader() {

    const navigate = useNavigate();

    return (

        <div className="history-header">

            <div className="history-header-left">

                <h1>

                    History

                </h1>

                <p>

                    View and manage all processed images.

                </p>

            </div>

            <div className="history-header-right">

                <div className="history-total">

                    <span>Total Images</span>

                    <h2>126</h2>
                </div>

                <button

                    className="upload-button"

                    onClick={() => navigate("/upload")}

                >

                    Upload Images

                </button>

            </div>

        </div>

    );

}

export default HistoryHeader;