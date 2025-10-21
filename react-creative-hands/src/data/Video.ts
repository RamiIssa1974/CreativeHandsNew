export type Video = {
    id: number;
    name: string;        // never null on client
    description: string; // never null on client
    extension: string;
    title: string;
};


export type ServerVideo = {
    Id?: number | null;
    VideoName?: string | null;
    Description?: string | null;
    Extension?: string | null;
    Title?: string | null;
};

