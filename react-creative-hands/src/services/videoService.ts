
import { ServerVideo, Video } from '../data/Video';

//const VIDEOS_API_BASE_URL = 'http://localhost:7163/api/video';
const VIDEOS_API_BASE_URL = 'http://194.36.89.39:7163/api/video';
//const API_UPLOAD_BASE_URL = 'http://localhost:7163/Api';

export async function saveVideo(videoData: Video, fileToUpload: File): Promise<number | null> {
    try {
        const fd = new FormData();
        fd.append("file", fileToUpload, fileToUpload.name);
        fd.append("request.Id", videoData.id.toString());
        fd.append("request.Name", videoData.name.toString());
        fd.append("request.Extension", videoData.extension.toString());
        fd.append("request.Title", videoData.title.toString());
        fd.append("request.Description", videoData.description.toString());

        console.log("Video save request: ", videoData);

        const response = await fetch(`${VIDEOS_API_BASE_URL}/SaveVideoNew`, {
            method: 'POST',
            body: fd, // No need to set Content-Type, browser sets it automatically
        });

        console.log("📥 Got response status:", response.status);

        if (!response.ok) {
            const errText = await response.text();
            console.error("❌ Save video failed", errText);
            return null;
        }

        const uploadFilesResponse = await response.json();
        console.log("✅ Response JSON (ID):", uploadFilesResponse.VideoId);
        return uploadFilesResponse.VideoId;

    } catch (error) {
        console.error("❌ Save video error", error);
        return null;
    }
}

export async function getVideos(videoId:number): Promise<Video[]> {
    try { 
        const request: ServerVideo = {
            Id: videoId,
            VideoName: '',
            Description: '',
            Extension:'',
            Title: ''
        };
        const response = await fetch(`${VIDEOS_API_BASE_URL}/Videos`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            console.error("Failed to fetch videos");
            return [];
        }

        const rawVideos: ServerVideo[] = await response.json();

        const mappedVideoIds = rawVideos.map(mapServerToClientVideo);

        return mappedVideoIds;
    } catch (error) {
        console.error("Error fetching video", error);
        return [];
    }
}
export async function deleteVideo(videoId: number): Promise<boolean> {
    try {
        const response = await fetch(`${VIDEOS_API_BASE_URL}/DeleteVideo/${videoId}`, {
            method: 'DELETE',
        });

        return response.ok;
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
        Description: clientVideo.description, // or Description
        Title: clientVideo.title,        
    };
}
 