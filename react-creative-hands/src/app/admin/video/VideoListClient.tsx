'use client';
import { useEffect, useState } from 'react';
import '@/app/styles/VideoPage.css'
import { getVideos, saveVideo } from '@/services/videoService';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Video } from '@/data/Video';

// (Paste your full component code here without change)
const VideoListClient = () => {
    const searchParams = useSearchParams();
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [id, setId] = useState(0);
    const [name, setName] = useState('');
    const [extension, setExtension] = useState('');
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const idParam = searchParams.get('videoId');
    const videoId = idParam ? Number(idParam) : 0;

    const modeParam = searchParams.get('mode');
    const mode: 'add' | 'edit' | 'view' =
        videoId === 0 ? 'add' : modeParam === 'view' ? 'view' : 'edit';

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';
    useEffect(() => {
        const loadVideo = async () => {
            try {
                setLoadingVideo(true);
                if (videoId > 0 && (isEditMode || isViewMode)) {
                    const vids = await getVideos(videoId);
                    const vid = vids[0];
                    setId(vid.id)
                    setName(vid.name);
                    setExtension(vid.extension);
                    setDescription(vid.description);
                    setTitle(vid.title);
                }
            } catch (error) {
                console.error("Error loading videos:", error);
            } finally {
                setLoadingVideo(false);
            }

        }

        loadVideo();
    }, [])
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);




    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        const _video: Video = {
            id: videoId,
            name: name,
            description: description,
            extension: extension,
            title: title,
        };

        try {
            if (!videoFile) {
                alert("❌ الرجاء اختيار ملف الفيديو قبل الحفظ");
                return;
            }

            console.log("🔄 Saving video with file:", _video, videoFile);

            const vidId = await saveVideo(_video, videoFile);
            console.log("handleSubmit video vidId:", vidId);

            if (vidId && vidId > 0) {
                const successMessage = isEditMode ? '✅ تم تحديث الفيديو بنجاح!' : '✅ تم حفظ الفيديو بنجاح!';
                alert(successMessage);
            } else {
                alert('❌ فشل أثناء حفظ الفيديو');
            }
        } catch (error) {
            console.error("❌ Error saving video:", error);
            alert('❌ حدث خطأ أثناء حفظ الفيديو');
        }
    }


    if (loadingVideo) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جاري تحميل الفيديو...</p>
            </div>
        );
    }
    return (
        <div className="video-container">
            <h1>
                {isViewMode ? 'عرض الفيديو' : isEditMode ? 'تعديل الفيديو' : 'إضافة فيديو جديد'}
            </h1>
            <form className="add-video-form" onSubmit={handleSubmit}>
                {/* Section 1: Basic Info */}
                <div className="section section-basic-info">
                    <h2>معلومات الفيديو</h2>

                    <label>المعرف:</label>
                    <input type="text" value={id} disabled />

                    <label>اسم الفيديو:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={isViewMode} required />
                    <label>عنوان الفيديو:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} disabled={isViewMode} required />

                    <label>الوصف:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={isViewMode} required />
                    <div className="video-upload-wrapper">
                        <label className="video-upload-button">
                            ➕ إضافة فيديو
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        setVideoFile(file);

                                        const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
                                        setExtension(extension);

                                        if (previewUrl) {
                                            URL.revokeObjectURL(previewUrl);
                                        }

                                        const newPreviewUrl = URL.createObjectURL(file);
                                        setPreviewUrl(newPreviewUrl);
                                    }
                                }}


                                disabled={isViewMode}
                                style={{ display: 'none' }}
                            />

                        </label>
                    </div>
                </div>


                {/* Section 6: Submit */}
                {!isViewMode && (
                    <div className="section section-submit">
                        <button type="submit">{isEditMode ? 'تحديث المنتج' : 'حفظ المنتج'}</button>
                    </div>
                )}
                {(previewUrl || (!isAddMode && name && extension)) && (
                    <div className="video-preview">
                        <p>📽️ {previewUrl ? 'تمت إضافة الفيديو — المعاينة:' : 'الفيديو الحالي:'}</p>
                        <video
                            key={previewUrl || `${name}.${extension}`}
                            width="320"
                            height="240"
                            controls
                        >
                            <source
                                src={
                                    previewUrl ||
                                    `http://creativehandsco.com/assets/videos/${name.toLowerCase().endsWith(`.${extension.toLowerCase()}`)
                                        ? name
                                        : `${name}.${extension}`
                                    }`
                                }
                                type="video/mp4"
                            />
                            المتصفح لا يدعم عرض الفيديو.
                        </video>
                    </div>
                )}

            </form>
        </div>
    );
}

export default VideoListClient;
