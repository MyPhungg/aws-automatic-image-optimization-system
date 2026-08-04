import "./HistoryRow.css";

import type { ProcessingHistory } from "../../../types/ProcessingHistory";

interface Props{

    item:ProcessingHistory;

}

function HistoryRow({item}:Props){

    return(

        <tr>

            <td>

                <img

                    src={item.thumbnail}

                    alt={item.fileName}

                    className="history-thumbnail"

                />

            </td>

            <td>{item.fileName}</td>

            <td>{item.originalSize}</td>

            <td>{item.optimizedSize}</td>

            <td>{item.preset}</td>

            <td>

                <span

                    className={`status ${item.status.toLowerCase()}`}

                >

                    {item.status}

                </span>

            </td>

            <td>{item.uploadTime}</td>

            <td>

                {

                    item.status==="Completed"

                    ?

                    <button>

                        Download

                    </button>

                    :

                    item.status==="Processing"

                    ?

                    <button>

                        View

                    </button>

                    :

                    <button>

                        Retry

                    </button>

                }

            </td>

        </tr>

    );

}

export default HistoryRow;