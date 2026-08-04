import "./HistoryTable.css";

import { dashboardHistory } from "../../../data/dashboardHistory";

import HistoryRow from "./HistoryRow";

function HistoryTable(){

    return(

        <div className="history-table-wrapper">

            <table className="history-table">

                <thead>

                    <tr>

                        <th>Image</th>

                        <th>Filename</th>

                        <th>Original</th>

                        <th>Optimized</th>

                        <th>Preset</th>

                        <th>Status</th>

                        <th>Time</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        dashboardHistory.map(item=>(

                            <HistoryRow

                                key={item.id}

                                item={item}

                            />

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default HistoryTable;