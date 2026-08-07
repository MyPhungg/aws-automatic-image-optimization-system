import "./History.css";

import HistoryHeader from "./components/HistoryHeader";
import { useState } from "react";
import SearchBar from "./components/SearchBar";
import FilterBar from "./components/FilterBar";
import HistoryTable from "./components/HistoryTable";
import Pagination from "./components/Pagination";
function HistoryPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [preset, setPreset] = useState("ALL");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    return (
        <div className="history-page">
            <div className="history-toolbar">
                <SearchBar
                    value={search}
                    onChange={(val) => {
                        setSearch(val);
                        setCurrentPage(1);
                    }}
                />
                <FilterBar
                    status={status}
                    preset={preset}
                    onStatusChange={(val) => {
                        setStatus(val);
                        setCurrentPage(1);
                    }}
                    onPresetChange={(val) => {
                        setPreset(val);
                        setCurrentPage(1);
                    }}
                    onReset={() => {
                        setSearch("");
                        setStatus("ALL");
                        setPreset("ALL");
                        setCurrentPage(1);
                    }}
                />
            </div>

            <HistoryHeader totalItems={totalItems} />
            <HistoryTable
                search={search}
                status={status}
                preset={preset}
                currentPage={currentPage}
                pageSize={pageSize}
                onTotalItemsChange={setTotalItems}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage}/>
        </div>
    );
}

export default HistoryPage;