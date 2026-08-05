export interface ProcessingHistory {

    id: string;

    thumbnail: string;

    fileName: string;

    originalSize: string;

    optimizedSize: string;

    preset: string;

    status: "Completed" | "Processing" | "Failed";

    uploadTime: string;

}