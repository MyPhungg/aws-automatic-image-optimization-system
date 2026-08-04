// Chức năng:
// 1. Quản lý danh sách ảnh
// 2. Nhận ảnh từ UploadDropzone
// 3. Hiển thị Preview
// 4. Xóa ảnh
// 5. Chuẩn bị dữ liệu cho Upload S3
//
// Những chức năng sau sẽ bổ sung:
// - Compression Mode
// - Preset
// - Upload Progress
// - Lambda Status
// - Download

import { useEffect, useState } from "react";
import type { CompressionModeType } from "./components/compressionMode/CompressionMode.tsx";
import type { CompressionPreset, Imageitem } from "../../types/ImageItem";
import { validateImages } from "../../utils/validation.ts";
import CompressionMode from "./components/compressionMode/CompressionMode.tsx";
import MainLayout from "../../layouts/MainLayout";
import PresetCards from "./components/PresetCard/Presetcard.tsx";
import PreviewList from "./components/ImagePreviewList/PreviewList.tsx";
import UploadDropzone from "../upload/components/UploadDropzone/UploadDropzone.tsx";
import UploadSummary from "./components/UploadSummary/UploadSummary.tsx";

import "./UploadPage.css";

function UploadPage() {
  const [images, setImages] = useState<Imageitem[]>([]);
  const [mode, setMode] = useState<CompressionModeType>("GLOBAL");
  const [globalPreset, setGlobalPreset] = useState<CompressionPreset>("BALANCED");

  const handleImagesAdded = (newImages: Imageitem[]) => {
    setImages((previous) => [...previous, ...newImages]);
  };

  const handleRemoveImage = (imageId: string) => {
    setImages((previous) => previous.filter((image) => image.id !== imageId));
  };

  const handlePresetChange = (id: string, preset: CompressionPreset) => {
    setImages((previous) =>
      previous.map((image) =>
        image.id === id
          ? {
              ...image,
              preset,
            }
          : image
      )
    );
  };

  const handleUpload = () => {
    const result = validateImages(images, mode, globalPreset);
    if (!result.valid) {
      alert(result.errors.join("\n"));
      console.log("Validation errors:", result.errors);
      return;
    }

    if (result.warnings.length > 0) {
      alert(["Upload warnings:", ...result.warnings].join("\n"));
      console.log("Validation warnings:", result.warnings);
    }

    console.log("Validation passed.");
  };

  useEffect(() => {
    if (mode !== "CUSTOM") {
      return;
    }

    setImages((previous) => previous.map((image) => ({ ...image, preset: globalPreset })));
  }, [mode, globalPreset]);

  return (
    
      <div className="upload-page">
        <div className="upload-header">
          <h1>Upload Images</h1>
          <p>Upload one or multiple images for automatic optimization.</p>
        </div>

        <UploadDropzone onImagesAdded={handleImagesAdded} />

        <PreviewList
          images={images}
          mode={mode}
          onRemove={handleRemoveImage}
          onPresetChange={handlePresetChange}
        />

        <CompressionMode mode={mode} onChange={setMode} />

        {mode === "GLOBAL" && (
          <PresetCards selected={globalPreset} onChange={setGlobalPreset} />
        )}

        <div className="next-step">
          <button>Continue</button>
        </div>

        <UploadSummary
          images={images}
          mode={mode}
          preset={globalPreset}
          onStart={handleUpload}
        />
      </div>
   
  );
}

export default UploadPage;
