import type { ProcessingHistory } from "../types/ProcessingHistory";

export const dashboardHistory: ProcessingHistory[] = [

    {

        id: "1",

        thumbnail: "https://picsum.photos/60?1",

        fileName: "cat.png",

        originalSize: "4.2 MB",

        optimizedSize: "1.5 MB",

        preset: "Balanced",

        status: "Completed",

        uploadTime: "2 mins ago"

    },

    {

        id: "2",

        thumbnail: "https://picsum.photos/60?2",

        fileName: "dog.jpg",

        originalSize: "5.1 MB",

        optimizedSize: "2.3 MB",

        preset: "High Quality",

        status: "Processing",

        uploadTime: "5 mins ago"

    },

    {

        id: "3",

        thumbnail: "https://picsum.photos/60?3",

        fileName: "office.png",

        originalSize: "3.8 MB",

        optimizedSize: "1.2 MB",

        preset: "Storage Saver",

        status: "Failed",

        uploadTime: "Yesterday"

    }

];