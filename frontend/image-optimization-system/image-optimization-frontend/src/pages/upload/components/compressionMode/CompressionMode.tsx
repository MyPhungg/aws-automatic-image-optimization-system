import "./CompressionMode.css";

export type CompressionModeType =
    | "GLOBAL"
    | "CUSTOM";

interface CompressionModeProps {

    mode: CompressionModeType;

    onChange: (

        mode: CompressionModeType

    ) => void;

}

function CompressionMode({

    mode,

    onChange

}: CompressionModeProps) {

    return (

        <div className="compression-mode">

            <h2>

                Compression Mode

            </h2>

            <p>

                Choose how optimization presets will be applied.

            </p>

            <label className="mode-item">

                <input

                    type="radio"

                    checked={mode === "GLOBAL"}

                    onChange={() =>

                        onChange("GLOBAL")

                    }

                />

                <div>

                    <strong>

                        Apply to all images

                    </strong>

                    <p>

                        One preset will be applied to every uploaded image.

                    </p>

                </div>

            </label>

            <label className="mode-item">

                <input

                    type="radio"

                    checked={mode === "CUSTOM"}

                    onChange={() =>

                        onChange("CUSTOM")

                    }

                />

                <div>

                    <strong>

                        Customize each image

                    </strong>

                    <p>

                        Select a different preset for each image.

                    </p>

                </div>

            </label>

        </div>

    );

}

export default CompressionMode;