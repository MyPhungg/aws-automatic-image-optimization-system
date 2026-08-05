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

import { useEffect, useRef, useState } from "react";
import type { CompressionModeType } from "./components/compressionMode/CompressionMode.tsx";
import type { CompressionPreset, Imageitem, ImageStatus } from "../../types/ImageItem";
import { validateImages } from "../../utils/validation.ts";
import CompressionMode from "./components/compressionMode/CompressionMode.tsx";
import PresetCards from "./components/PresetCard/Presetcard.tsx";
import PreviewList from "./components/ImagePreviewList/PreviewList.tsx";
import UploadDropzone from "../upload/components/UploadDropzone/UploadDropzone.tsx";
import UploadSummary from "./components/UploadSummary/UploadSummary.tsx";

import "./UploadPage.css";
import { imageService } from "../../services/imageService.ts";

function getPresetConfig(preset: CompressionPreset) {
  switch (preset) {
    case "HIGH_QUALITY":
      return {
        quality: 95,
        resizeEnabled: true,
        maxWidth: 2048,
        maxHeight: 2048,
      };
    case "SAVE_SPACE":
      return {
        quality: 60,
        resizeEnabled: true,
        maxWidth: 1200,
        maxHeight: 1200,
      };
    case "BALANCED":
    default:
      return {
        quality: 80,
        resizeEnabled: true,
        maxWidth: 1600,
        maxHeight: 1600,
      };
  }
}

function getUploadFormat(files: File[]) {
  const file = files[0];

  if (!file) {
    return "jpg";
  }

  if (file.type.includes("png")) return "png";
  if (file.type.includes("webp")) return "webp";
  if (file.type.includes("jpeg") || file.type.includes("jpg")) return "jpg";

  return "jpg";
}

function UploadPage() {
  const [images, setImages] = useState<Imageitem[]>([]);
  const [mode, setMode] = useState<CompressionModeType>("GLOBAL");
  const [globalPreset, setGlobalPreset] = useState<CompressionPreset>("BALANCED");
  const pollingRef = useRef<number | null>(null);

  const clearPolling = () => {
    if (pollingRef.current !== null) {
      window.clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const syncImagesWithBatch = (batchResponse: { batchId?: string; images?: Array<{
    processingId?: string;
    originalName?: string;
    status?: string;
    originalSize?: number;
    processedSize?: number;
    compressionRatio?: number;
    format?: string;
    downloadUrl?: string;
    thumbnailUrl?: string;
  }> }) => {
    const normalizedBatchId = batchResponse.batchId;

    setImages((previous) =>
      previous.map((image) => {
        const matchedImage = batchResponse.images?.find((item) => {
          const originalName = item.originalName?.toLowerCase();
          return originalName === image.name.toLowerCase() || originalName === image.file.name.toLowerCase();
        });

        if (!matchedImage) {
          return image;
        }

        const status = (matchedImage.status?.toUpperCase() as ImageStatus) ?? image.status;
        const progress = status === "SUCCESS"
          ? 100
          : status === "FAILED"
            ? 100
            : Math.min(image.progress + 15, 90);

        return {
          ...image,
          batchId: normalizedBatchId ?? image.batchId,
          processingId: matchedImage.processingId ?? image.processingId,
          status,
          progress,
          result: status === "SUCCESS"
            ? {
                originalSize: matchedImage.originalSize ?? image.size,
                optimizedSize: matchedImage.processedSize,
                compressionRatio: matchedImage.compressionRatio,
                outputUrl: matchedImage.downloadUrl,
                thumbnailUrl: matchedImage.thumbnailUrl,
              }
            : image.result,
        };
      })
    );
  };

  const pollBatchStatus = async (batchId: string) => {
    try {
      const response = await imageService.getBatch(batchId);
      const batchResponse = response.data;
      syncImagesWithBatch(batchResponse);

      const hasProcessing = batchResponse.images?.some((item: { status?: string }) => item.status?.toUpperCase() === "PROCESSING");
      if (!hasProcessing) {
        clearPolling();
      }
    } catch (error) {
      console.error(error);
      clearPolling();
    }
  };

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

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, []);

  const handleUpload = async () => {

    const result = validateImages(images, mode, globalPreset);

    if (!result.valid) {

        alert(result.errors.join("\n"));

        return;

    }

    try {

        const selectedPreset = mode === "CUSTOM"
            ? images[0]?.preset ?? globalPreset
            : globalPreset;

        const response = await imageService.upload(images.map((image) => image.file), {
            format: getUploadFormat(images.map((image) => image.file)),
            config: getPresetConfig(selectedPreset),
        });

        const batchId = response.data.batchId;

        setImages((previous) =>
          previous.map((image) => ({
            ...image,
            batchId,
            status: "PROCESSING" as ImageStatus,
            progress: 10,
          }))
        );

        clearPolling();
        pollingRef.current = window.setInterval(() => {
          void pollBatchStatus(batchId);
        }, 4000);

    }

    catch(error){

        console.error(error);
        alert("Unable to connect to the backend. Please verify that the Spring Boot server is running on port 8080.");

    }

}

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
