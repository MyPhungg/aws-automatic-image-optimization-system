import "./ProgressBar.css";

interface ProgressBarProps {

    value: number;

}

function ProgressBar({

    value

}: ProgressBarProps) {

    return (

        <div className="progress">

            <div

                className="progress-fill"

                style={{

                    width: `${value}%`

                }}

            />

            <span>

                {value}%

            </span>

        </div>

    );

}

export default ProgressBar;