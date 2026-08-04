import "./HistoryRow.css";

import "./HistoryRow.css";

import { useState } from "react";
import type { HistoryResponse } from "../../../services/dashBoardService";
import { dashBoardService } from "../../../services/dashBoardService";

interface Props{
    item: HistoryResponse | any;
}

function HistoryRow({item}:Props){

    const [loading, setLoading] = useState(false);

    const handleView = async () => {
        setLoading(true);
        try{
            const res = await dashBoardService.getBatch(item.batchId);
            // navigate or open modal with batch data; for now log
            console.log('batch', res.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };

    return(

        <tr>

            <td>{item.batchId}</td>

            <td>{item.uploadedAt}</td>

            <td>{item.totalImages}</td>

            <td>{item.successImages}</td>

            <td>{item.failedImages}</td>

            <td>

                <button onClick={handleView} disabled={loading}>
                    {loading ? 'Loading...' : 'View'}
                </button>

            </td>

        </tr>

    );

}

export default HistoryRow;