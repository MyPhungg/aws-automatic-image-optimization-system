import "./PreviewList.css";

import type { CompressionPreset, Imageitem } from "../../../../types/ImageItem";
import ImageCard from "../ImageCard/ImageCard";
import type { CompressionModeType } from "../compressionMode/CompressionMode";
interface ImagePreviewListProps{

    images:Imageitem[];

    mode:CompressionModeType;

    onRemove:(id:string)=>void;

    onPresetChange:(

        id:string,

        preset:CompressionPreset

    )=>void;

}

function PreviewList({

    images,

    mode,

    onRemove,

    onPresetChange

}: ImagePreviewListProps) {

    if (images.length === 0) {

        return (

            <div className="empty-preview">

                <h3>No Images Selected</h3>

                <p>

                    Upload one or multiple images to preview them here.

                </p>

            </div>

        );

    }
    
    return (

        <div className="preview-list">

            {images.map((image) => (

                <ImageCard

                    key={image.id}

                    image={image}

                    mode={mode}

                    onRemove={onRemove}

                    onPresetChange={onPresetChange}

                />

            ))}

        </div>

    );

}

export default PreviewList;