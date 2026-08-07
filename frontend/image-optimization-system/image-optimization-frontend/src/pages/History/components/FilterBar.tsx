import "./FilterBar.css";

interface FilterBarProps {

    status: string;

    preset: string;

    onStatusChange: (value: string) => void;

    onPresetChange: (value: string) => void;

    onReset: () => void;

}

function FilterBar({

    status,

    preset,

    onStatusChange,

    onPresetChange,

    onReset,

}: FilterBarProps) {

    return (

        <div className="filter-bar">

            <select

                value={status}

                onChange={(e) => onStatusChange(e.target.value)}

            >

                <option value="ALL">

                    All Status

                </option>

                <option value="Completed">

                    Completed

                </option>

                <option value="Processing">

                    Processing

                </option>

                <option value="Failed">

                    Failed

                </option>

            </select>

            <select

                value={preset}

                onChange={(e) => onPresetChange(e.target.value)}

            >

                <option value="ALL">

                    All Presets

                </option>

                <option value="Balanced">

                    Balanced

                </option>

                <option value="High Quality">

                    High Quality

                </option>

                <option value="Storage Saver">

                    Storage Saver

                </option>

            </select>

            <button

                onClick={onReset}

            >

                Reset

            </button>

        </div>

    );

}

export default FilterBar;