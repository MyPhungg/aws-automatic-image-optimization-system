import "./UploadSummary.css";

import type { Imageitem } from "../../../../types/ImageItem";
import type { CompressionPreset } from "../../../../types/ImageItem";
import type { CompressionModeType } from "../compressionMode/CompressionMode";

interface UploadSummaryProps {

    images: Imageitem[];

    mode: CompressionModeType;

    preset: CompressionPreset;

    onStart: () => void;

}

function formatFileSize(size:number){

    if(size<1024)

        return `${size} B`;

    if(size<1024*1024)

        return `${(size/1024).toFixed(2)} KB`;

    return `${(size/1024/1024).toFixed(2)} MB`;

}
function getSavingRate(preset:CompressionPreset): number {
    switch (preset) {

        case "HIGH_QUALITY":
            return 20;

        case "BALANCED":
            return 50;

        case "SAVE_SPACE":
            return 70;

        default:
            return 50;

    }
}

function UploadSummary({

    images,

    mode,

    preset,

    onStart

}:UploadSummaryProps){

    const totalSize=

        images.reduce(

            (sum,image)=>sum+image.size,

            0

        );
    const savingRate = getSavingRate(preset);

    const estimatedOutputSize = totalSize * (1 - savingRate / 100);

    return(

        <section className="upload-summary">

            <h2>

                Upload Summary

            </h2>

            <div className="summary-grid">

                <div>

                    <span>

                        Images

                    </span>

                    <strong>

                        {images.length}

                    </strong>

                </div>

                <div>

                    <span>

                        Original Size

                    </span>

                    <strong>

                        {formatFileSize(totalSize)}

                    </strong>

                </div>
                <div>

                    <span>

                        Estimated Saving

                    </span>

                    <strong>

                        {savingRate}%

                    </strong>

                </div>
                <div>

                    <span>

                        Estimated Output

                    </span>

                    <strong>

                        {

                            formatFileSize(

                                estimatedOutputSize

                            )

                        }

                    </strong>

                </div>
                <div>

                    <span>

                        Average Quality

                    </span>

                    <strong>

                        {

                            preset==="HIGH_QUALITY"

                            ?

                            "95%"

                            :

                            preset==="BALANCED"

                            ?

                            "80%"

                            :

                            "60%"

                        }

                    </strong>

                </div>
                <div>

                    <span>

                        Compression Mode

                    </span>

                    <strong>

                        {

                            mode==="GLOBAL"

                            ?

                            "Apply to all"

                            :

                            "Customize"

                        }

                    </strong>

                </div>

                <div>

                    <span>

                        Preset

                    </span>

                    <strong>

                        {preset}

                    </strong>

                </div>

            </div>

            <button

                className="start-btn"

                onClick={onStart}

                disabled={images.length===0}

            >

                Start Optimization

            </button>

        </section>

    );

}

export default UploadSummary;