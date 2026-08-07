import { type ChangeEvent, type DragEvent, useRef } from "react";
import type { Imageitem } from "../../../../types/ImageItem";
import "./UploadDropzone.css";

type UploadImageItem = Imageitem & { previewUrl: string };

interface UploadDropzoneProps {

    onImagesAdded: (images: UploadImageItem[]) => void;

}

function UploadDropzone({

    onImagesAdded

}: UploadDropzoneProps) {

    const inputRef = useRef<HTMLInputElement>(null);

    //------------------------------------------------------
    // Chuyển File -> ImageItem
    //------------------------------------------------------

    const getImageMetadata = async (file: File) => {
        const buffer = await file.arrayBuffer();
        const digest = await crypto.subtle.digest("SHA-256", buffer);
        const hash = Array.from(new Uint8Array(digest))
            .map((value) => value.toString(16).padStart(2, "0"))
            .join("");

        let width = 0;
        let height = 0;

        try {
            const bitmap = await createImageBitmap(file);
            width = bitmap.width;
            height = bitmap.height;
            bitmap.close();
        } catch {
            const metadataImage = await new Promise<HTMLImageElement>((resolve, reject) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.onerror = () => reject(new Error("Unable to read image metadata."));
                image.src = URL.createObjectURL(file);
            });

            width = metadataImage.width;
            height = metadataImage.height;
            URL.revokeObjectURL(metadataImage.src);
        }

        return {
            width,
            height,
            hash,
            totalPixels: width * height,
        };
    };

    const createImageItems = async (files: FileList): Promise<Imageitem[]> => {
        const imageItems: Imageitem[] = [];

        const promises = Array.from(files).map(async (file) => {
            if (!file.type.startsWith("image/")) {
                return null;
            }

            const metadata = await getImageMetadata(file);

            return {
                id: crypto.randomUUID(),
                file,
                previewUrl: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                type: file.type,
                preset: "BALANCED" as const,
                status: "PENDING" as const,
                progress: 0,
                createdAt: new Date(),
                width: metadata.width,
                height: metadata.height,
                totalPixels: metadata.totalPixels,
                hash: metadata.hash,
            };
        });

        const createdItems = await Promise.all(promises);
        createdItems.forEach((item) => {
            if (item) {
                imageItems.push(item);
            }
        });

        return imageItems;
    };

    //------------------------------------------------------
    // Chọn file
    //------------------------------------------------------

    const handleFileChange = async (

        event: ChangeEvent<HTMLInputElement>

    ) => {

        if (!event.target.files) return;

        const images = await createImageItems(event.target.files);

        onImagesAdded(images);

        event.target.value = "";

    };

    //------------------------------------------------------
    // Drag Over
    //------------------------------------------------------

    const handleDragOver = (

        event: DragEvent<HTMLDivElement>

    ) => {

        event.preventDefault();

    };

    //------------------------------------------------------
    // Drop
    //------------------------------------------------------

    const handleDrop = async (

        event: DragEvent<HTMLDivElement>

    ) => {

        event.preventDefault();

        if (!event.dataTransfer.files) return;

        const images = await createImageItems(

            event.dataTransfer.files

        );

        onImagesAdded(images);

    };

    //------------------------------------------------------

    return (

        <div

            className="dropzone"

            onDragOver={handleDragOver}

            onDrop={handleDrop}

        >

            <input

                ref={inputRef}

                type="file"

                accept="image/*"

                multiple

                hidden

                onChange={handleFileChange}

            />

            <div className="dropzone-content">

                <div className="upload-icon">

                    📁

                </div>

                <h2>

                    Drag & Drop Images Here

                </h2>

                <p>

                    or

                </p>

                <button

                    onClick={() => inputRef.current?.click()}

                >

                    Choose Images

                </button>

                <span>

                    JPEG • PNG • WEBP

                </span>

            </div>

        </div>

    );

}

export default UploadDropzone;