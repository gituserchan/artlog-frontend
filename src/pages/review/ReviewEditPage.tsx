import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { uploadImages } from "../../api/fileApi";
import { getReview, updateReview } from "../../api/reviewApi";
import type { ReviewVisibility } from "../../types/review";

function ReviewEditPage() {
    const navigate = useNavigate();
    const params = useParams();

    const reviewId = Number(params.reviewId);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [emotionTag, setEmotionTag] = useState("");
    const [keywords, setKeywords] = useState("");
    const [wantToRevisit, setWantToRevisit] = useState(false);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [visibility, setVisibility] = useState<ReviewVisibility>("PRIVATE");

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    const getImageSrc = (imageUrl: string) => {
        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
    };

    const fetchReview = async () => {
        if (!reviewId || Number.isNaN(reviewId)) {
            setMessage("올바르지 않은 감상 기록입니다.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await getReview(reviewId);
            const review = response.data;

            setTitle(review.title);
            setContent(review.content);
            setRating(review.rating);
            setEmotionTag(review.emotionTag || "");
            setKeywords(review.keywords || "");
            setWantToRevisit(!!review.wantToRevisit);
            setImageUrls(review.imageUrls || []);
            setVisibility(review.visibility);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "감상 기록을 불러오지 못했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("감상 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReview();
    }, [reviewId]);

    const handleImageFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(event.target.files || []);

        if (files.length > 10) {
            setMessage("이미지는 최대 10장까지 선택할 수 있습니다.");
            event.target.value = "";
            return;
        }

        setImageFiles(files);
        setMessage("");
    };

    const handleRemoveExistingImages = () => {
        setImageUrls([]);
        setImageFiles([]);
        setMessage("기존 이미지를 모두 삭제하도록 설정했습니다.");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!reviewId || Number.isNaN(reviewId)) {
            setMessage("올바르지 않은 감상 기록입니다.");
            return;
        }

        setSubmitting(true);
        setMessage("");

        try {
            const nextImageUrls =
                imageFiles.length > 0 ? await uploadImages(imageFiles) : imageUrls;

            const response = await updateReview(reviewId, {
                title,
                content,
                rating,
                emotionTag,
                keywords,
                wantToRevisit,
                imageUrls: nextImageUrls,
                visibility,
            });

            alert("감상 기록이 수정되었습니다.");
            navigate(`/reviews/${response.data.reviewId}`);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "감상 기록 수정에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("감상 기록 수정에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p className="info-text">감상 기록을 불러오는 중입니다.</p>;
    }

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Edit review</p>
                    <h1>감상 기록 수정</h1>
                    <p className="page-description">
                        작성한 감상 제목, 내용, 평점, 이미지, 공개 여부를 수정할 수
                        있습니다.
                    </p>
                </div>
            </div>

            {message && <p className="error-text">{message}</p>}

            <form className="record-form" onSubmit={handleSubmit}>
                <div>
                    <label>감상 제목</label>
                    <input
                        value={title}
                        required
                        maxLength={100}
                        placeholder="감상 제목을 입력하세요"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>

                <div>
                    <label>감상 내용</label>
                    <textarea
                        value={content}
                        required
                        placeholder="감상 내용을 입력하세요"
                        onChange={(event) => setContent(event.target.value)}
                    />
                </div>

                <div>
                    <label>평점</label>
                    <input
                        type="number"
                        min={1}
                        max={5}
                        value={rating}
                        required
                        onChange={(event) => setRating(Number(event.target.value))}
                    />
                </div>

                <div>
                    <label>감정 태그</label>
                    <input
                        value={emotionTag}
                        maxLength={100}
                        placeholder="예: 따뜻함, 낯섦, 압도감"
                        onChange={(event) => setEmotionTag(event.target.value)}
                    />
                </div>

                <div>
                    <label>키워드</label>
                    <input
                        value={keywords}
                        maxLength={255}
                        placeholder="예: 설치미술, 회화, 기억, 도시"
                        onChange={(event) => setKeywords(event.target.value)}
                    />
                </div>

                {imageUrls.length > 0 && imageFiles.length === 0 && (
                    <div className="image-preview">
                        <p>현재 이미지 {imageUrls.length}장</p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                                gap: "10px",
                            }}
                        >
                            {imageUrls.map((imageUrl) => (
                                <img
                                    key={imageUrl}
                                    src={getImageSrc(imageUrl)}
                                    alt="감상 이미지"
                                    style={{
                                        width: "100%",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                        border: "1px solid #e0d7ca",
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            type="button"
                            className="subtle-button"
                            style={{ marginTop: "12px" }}
                            onClick={handleRemoveExistingImages}
                        >
                            기존 이미지 모두 삭제
                        </button>
                    </div>
                )}

                <div>
                    <label>새 감상 이미지</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFileChange}
                    />
                    <p className="page-description">
                        새 이미지를 선택하면 기존 이미지 목록이 새 이미지로 교체됩니다.
                    </p>
                </div>

                {imageFiles.length > 0 && (
                    <div className="image-preview">
                        <p>새로 선택한 이미지 {imageFiles.length}장</p>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                                gap: "10px",
                            }}
                        >
                            {imageFiles.map((file) => (
                                <img
                                    key={`${file.name}-${file.lastModified}`}
                                    src={URL.createObjectURL(file)}
                                    alt={file.name}
                                    style={{
                                        width: "100%",
                                        height: "120px",
                                        objectFit: "cover",
                                        borderRadius: "12px",
                                        border: "1px solid #e0d7ca",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <label>재방문 의향</label>
                    <select
                        value={wantToRevisit ? "true" : "false"}
                        onChange={(event) => setWantToRevisit(event.target.value === "true")}
                    >
                        <option value="false">없음</option>
                        <option value="true">있음</option>
                    </select>
                </div>

                <div>
                    <label>공개 여부</label>
                    <select
                        value={visibility}
                        onChange={(event) =>
                            setVisibility(event.target.value as ReviewVisibility)
                        }
                    >
                        <option value="PRIVATE">비공개</option>
                        <option value="PUBLIC">공개</option>
                    </select>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "수정 중..." : "수정하기"}
                    </button>
                    <button
                        type="button"
                        className="subtle-button"
                        disabled={submitting}
                        onClick={() => navigate(`/reviews/${reviewId}`)}
                    >
                        취소
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ReviewEditPage;