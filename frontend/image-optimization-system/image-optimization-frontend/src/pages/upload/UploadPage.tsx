// Chức năng:
//
// 1. Quản lý danh sách ảnh
// 2. Nhận ảnh từ UploadDropzone
// 3. Hiển thị Preview
// 4. Xóa ảnh
// 5. Chuẩn bị dữ liệu cho Upload S3
//
// Những chức năng sau sẽ bổ sung:
//
// - Compression Mode
// - Preset
// - Upload Progress
// - Lambda Status
// - Download
import {useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import UploadDropzone from "../upload/components/UploadDropzone/UploadDropzone.tsx";
import PreviewList from "./components/ImagePreviewList/PreviewList.tsx";
import CompressionMode from "./components/compressionMode/CompressionMode.tsx";
import type { CompressionModeType } from "./components/compressionMode/CompressionMode.tsx";
import type { CompressionPreset, Imageitem } from "../../types/ImageItem";

import "./UploadPage.css";
import PresetCards from "./components/PresetCard/Presetcard.tsx";

function UploadPage() {
    const [images, setImages] = useState<Imageitem[]>([]);
    const handleIamgesAdded = (newImages: Imageitem[]) => {
        setImages((previous) => [...previous, ...newImages]);
    };
    
    const handleRemoveImage = (imageId: string) => {
        setImages((previous) => previous.filter((image) => image.id !== imageId));
    };
    const [mode, setMode] = useState<CompressionModeType>("GLOBAL");
    const [globalPreset,setGlobalPreset]=useState<CompressionPreset>("BALANCED");
    useEffect(() => {

    if (mode !== "CUSTOM") {

        return;

    }

    setImages(previous =>

        previous.map(image => ({

            ...image,

            preset: globalPreset

        }))

    );

}, [mode]);
    const handlePresetChange=(
    
id:string,

preset:CompressionPreset

)=>{

setImages((previous)=>

previous.map((image)=>

image.id===id

?

{

...image,

preset

}

:

image

)

);

};

    return (
        <MainLayout>
            <div className="upload-page">
                <div className="upload-header">
                    <h1>Upload Images</h1>
                    <p>Upload one or multiple images for automatic optimization.</p>
                </div>
                <UploadDropzone onImagesAdded={handleIamgesAdded} />
                <PreviewList

                images={images}

                mode={mode}

                onRemove={handleRemoveImage}

                onPresetChange={handlePresetChange}

                />
                <CompressionMode mode={mode} onChange={setMode} />
                {
                mode==="GLOBAL" &&
                <PresetCards
                selected={globalPreset}
                onChange={setGlobalPreset}
                />

                }
                
                <div className="next-step">
                    <button>Continue</button>
                </div>
            </div>
        </MainLayout>
    )
}
export default UploadPage;