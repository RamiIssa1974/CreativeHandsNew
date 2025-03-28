'use client';
import { useEffect, useState } from 'react';
import '@/app/styles/VideosListPage.css'
import { deleteVideo, getVideos } from '@/services/videoService';
import { Video } from '@/data/Video';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const VideosListPage = () => {
    const router = useRouter();
    const [loadingVideos, setLoadingVideos] = useState(false);
    const [videos, setVideos] = useState<Video[]>([]);
    const { user, isLoggedIn, loading } = useAuth();
     
    useEffect(() => {
        const loadVideos = async () => {
            try {
                setLoadingVideos(true);

                const vids = await getVideos(-1);
                setVideos(vids);
                //setFilteredProviders(provs);

            } catch (error) {
                console.error("Error loading videos:", error);
            } finally {
                setLoadingVideos(false);
            }

        }

        loadVideos();
    }, [])
    if (loadingVideos) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جاري تحميل الفيديوهات...</p>
            </div>
        );
    }
    function handleDeleteVideo(videoId: number): void {
        const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا الفيديو؟");

        if (!confirmed) return;

        deleteVideo(videoId)
            .then(success => {
                if (success) {
                    alert("✅ تم حذف الفيديو بنجاح");
                    setVideos(prev => prev.filter(p => p.id !== videoId));
                } else {
                    alert("❌ فشل في حذف الفيديو");
                }
            })
            .catch(error => {
                console.error("Delete error:", error);
                alert("❌ حدث خطأ أثناء الحذف");
            });
    }
    function handleEditVideo(videioId: number) {
        router.push(`/admin/video?videoId=${videioId}&mode=edit`);
    }
    return (
        <div className='vedios-container'>        
            {videos.map(video => (
                <div className="video-item" key={video.id}>
                    <div className="title">{video.description}</div>
                    <video width="320" height="240" controls>
                        <source type="video/mp4"
                            src={`http://creativehandsco.com/assets/videos/${video.name.toLowerCase().endsWith(`.${video.extension.toLowerCase()}`)
                                    ? video.name
                                    : `${video.name}.${video.extension}`
                                }`}/>                        
                    </video>
                    <div className="description">{video.description}</div>
                    {isLoggedIn && user?.isAdmin && (
                        <div>
                        <div className="delete-video-button">
                            <button                                
                                onClick={() => handleDeleteVideo(video.id)}
                                className="view-button">🗑️ حذف الفيديو </button>
                        </div>
                        <div className="edit-video-button">
                            <button                                
                                onClick={() => handleEditVideo(video.id)}
                                    className="edit-button"> ✏️ تعديل الفيديو </button>
                            </div>
                        </div>
                    ) }
                </div>
            ))
            }
        </div>
    );
}
export default VideosListPage;
