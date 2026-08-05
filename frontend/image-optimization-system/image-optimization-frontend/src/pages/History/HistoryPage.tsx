import "./History.css";

import HistoryHeader from "./components/HistoryHeader";
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import HistoryTable from "./components/HistoryTable";
import Pagination from "./components/Pagination";
function HistoryPage() {
    const [search,setSearch]=useState("");

    const [status,setStatus]=useState("ALL");

    const [preset,setPreset]=useState("ALL");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    return (

        <div className="history-page">
            <div className="history-toolbar">

                <SearchBar

                    value={search}

                    onChange={setSearch}

                />

                <FilterBar

                    status={status}

                    preset={preset}

                    onStatusChange={setStatus}

                    onPresetChange={setPreset}

                    onReset={() => {

                        setSearch("");

                        setStatus("ALL");

                        setPreset("ALL");

                    }}

                />

            </div>

            <HistoryHeader />
            <HistoryTable currentPage={currentPage} pageSize={pageSize} onTotalItemsChange={setTotalItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
        </div>

    );

}

export default HistoryPage;