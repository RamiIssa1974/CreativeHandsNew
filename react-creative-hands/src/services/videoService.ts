import axiosAuth from '@/utils/axiosAuth';
import { ServerVideo, Video } from '../data/Video';

const BASE_URL = 'video';

export async function saveVideo(videoData: Video, fileToUpload: File): Promise<number | null> {
    try {
        const fd = new FormData();
        fd.append("file", fileToUpload, fileToUpload.name);
        fd.append("request.Id", videoData.id.toString());
        fd.append("request.Name", videoData.name);
        fd.append("request.Extension", videoData.extension);
        fd.append("request.Title", videoData.title);
        fd.append("request.Description", videoData.description);

        console.log("Video save request:", videoData);

        const response = await axiosAuth.post(`${BASE_URL}/SaveVideoNew`, fd, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        console.log("📥 Got response status:", response.status);

        const uploadFilesResponse = response.data;
        console.log("✅ Response JSON (ID):", uploadFilesResponse.VideoId);
        return uploadFilesResponse.VideoId;
    } catch (error) {
        console.error("❌ Save video error", error);
        return null;
    }
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

        const response = await axiosAuth.post(`${BASE_URL}/Videos`, request);
        const rawVideos: ServerVideo[] = response.data;
        return rawVideos.map(mapServerToClientVideo);
    } catch (error) {
        console.error("Error fetching videos", error);
        return [];
    }
}

export async function deleteVideo(videoId: number): Promise<boolean> {
    try {
        const response = await axiosAuth.delete(`${BASE_URL}/DeleteVideo/${videoId}`);
        return response.status === 200;
    } catch (error) {
        console.error("Delete video error:", error);
        return false;
    }
}

export function mapServerToClientVideo(sVideo: ServerVideo): Video {
    return {
        id: sVideo.Id,
        name: sVideo.VideoName,
        description: sVideo.Description,
        extension: sVideo.Extension,
        title: sVideo.Title,
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
