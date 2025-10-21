import pyAxiosAuth from '@/utils/pyAxiosAuth';
import { ServerVideo, Video } from '../data/Video';
import { asString, asInt } from '@/helpers/helpers';

const BASE_URL = 'video';

export async function saveVideo(video: Video, file: File): Promise<number> {
    const fd = new FormData();

    fd.append("file", file);
    fd.append("Id", String(video?.id ?? -1));

    const name = (video?.name?.trim?.() || file.name.replace(/\.[^.]+$/, "") || "video");
    fd.append("VideoName", name);

    const ext = (video?.extension?.trim?.() || file.name.split(".").pop() || "").toLowerCase();
    fd.append("Extension", ext);

    fd.append("Title", video?.title ?? "");
    fd.append("Description", video?.description ?? "");

    const { data } = await pyAxiosAuth.post(`${BASE_URL}/SaveVideo`, fd, {
        // ✅ Kill any default JSON transform/headers for this request
        transformRequest: [(data, headers) => {
            // axios sometimes keeps a default JSON content-type; remove it
            delete (headers as any)["Content-Type"];
            delete (headers as any)["content-type"];
            return data;
        }],
        headers: {
            // don't set a value here; leaving it undefined lets the browser set the boundary
            // "Content-Type": will be auto-generated as 'multipart/form-data; boundary=...'
        },
    });

    return typeof (data as any)?.VideoId === "number" ? data.VideoId : Number(data) || 0;
}
export async function getVideos(videoId: number): Promise<Video[]> {
    try {
        const request: ServerVideo = {
            Id: videoId,
            VideoName: '',
            Description: '',
            Extension: '',
            Title: ''
        };

        const { data } = await pyAxiosAuth.post(`${BASE_URL}/Videos`, request);
        const raw: unknown = data;
        const list: ServerVideo[] = Array.isArray(raw) ? raw : raw ? [raw as ServerVideo] : [];

        return list.map(mapServerToClientVideo);
    } catch (error) {
        console.error("Error fetching videos", error);
        return [];
    }
}

export async function deleteVideo(videoId: number): Promise<boolean> {
    try {
        const response = await pyAxiosAuth.delete(`${BASE_URL}/DeleteVideo/${videoId}`);
        return response.status === 200;
    } catch (error) {
        console.error("Delete video error:", error);
        return false;
    }
}

export function mapServerToClientVideo(s: ServerVideo): Video {
    return {
        id: asInt(s?.Id),
        name: asString(s?.VideoName),
        description: asString(s?.Description),
        extension: asString(s?.Extension),
        title: asString(s?.Title),
    };
}

export function mapClientToServerVideo(clientVideo: Video): ServerVideo {
    return {
        Id: clientVideo.id,
        VideoName: clientVideo.name,
        Extension: clientVideo.extension,
        Description: clientVideo.description,
        Title: clientVideo.title,
    };
}
