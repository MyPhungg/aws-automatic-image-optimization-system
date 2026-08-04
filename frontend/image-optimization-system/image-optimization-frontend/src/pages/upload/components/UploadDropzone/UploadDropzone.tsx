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

    const createImageItems = (files: FileList): Imageitem[] => {

        const imageItems: Imageitem[] = [];

        Array.from(files).forEach((file) => {

            if (!file.type.startsWith("image/")) {

                return;

            }

            imageItems.push({

                id: crypto.randomUUID(),

                file,

                previewUrl: URL.createObjectURL(file),

                name: file.name,

                size: file.size,

                type: file.type,

                preset: "BALANCED",

                status: "PENDING",

                progress: 0,

                createdAt: new Date()

            });

        });

        return imageItems;

    };

    //------------------------------------------------------
    // Chọn file
    //------------------------------------------------------

    const handleFileChange = (

        event: ChangeEvent<HTMLInputElement>

    ) => {

        if (!event.target.files) return;

        const images = createImageItems(event.target.files);

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

    const handleDrop = (

        event: DragEvent<HTMLDivElement>

    ) => {

        event.preventDefault();

        if (!event.dataTransfer.files) return;

        const images = createImageItems(

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