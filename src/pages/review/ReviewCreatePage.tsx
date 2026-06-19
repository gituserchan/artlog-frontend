import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { uploadImages } from "../../api/fileApi";
import {
    createArtworkReview,
    createExhibitionReview,
} from "../../api/reviewApi";
import type { ReviewVisibility } from "../../types/review";

function ReviewCreatePage() {
    const navigate = useNavigate();
    const params = useParams();

    const exhibitionId = Number(params.exhibitionId);
    const artworkId = params.artworkId ? Number(params.artworkId) : null;

    const isArtworkReview = !!artworkId && !Number.isNaN(artworkId);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [emotionTag, setEmotionTag] = useState("");
    const [keywords, setKeywords] = useState("");
    const [wantToRevisit, setWantToRevisit] = useState(false);
    const [visibility, setVisibility] = useState<ReviewVisibility>("PRIVATE");
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState("");

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!exhibitionId || Number.isNaN(exhibitionId)) {
            setMessage("올바르지 않은 전시 기록입니다.");
            return;
        }

        setSubmitting(true);
        setMessage("");

        try {
            const imageUrls = imageFiles.length > 0 ? await uploadImages(imageFiles) : [];

            const request = {
                title,
                content,
                rating,
                emotionTag,
                keywords,
                wantToRevisit,
                imageUrls,
                visibility,
            };

            const response = isArtworkReview
                ? await createArtworkReview(exhibitionId, artworkId, request)
                : await createExhibitionReview(exhibitionId, request);

            alert("감상 기록이 등록되었습니다.");
            navigate(`/reviews/${response.data.reviewId}`);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "감상 기록 등록에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("감상 기록 등록에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">New review</p>
                    <h1>{isArtworkReview ? "작품 감상 작성" : "전시 감상 작성"}</h1>
                    <p className="page-description">
                        관람 경험과 인상 깊었던 감정을 감상 기록으로 남깁니다.
                    </p>
                </div>
            </div>

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

                <div>
                    <label>감상 이미지</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFileChange}
                    />
                    <p className="page-description">
                        이미지는 최대 10장까지 선택할 수 있습니다.
                    </p>
                </div>

                {imageFiles.length > 0 && (
                    <div className="image-preview">
                        <p>선택한 이미지 {imageFiles.length}장</p>

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

                {message && <p className="error-text">{message}</p>}

                <div className="form-actions">
                    <button type="submit" disabled={submitting}>
                        {submitting ? "등록 중..." : "등록하기"}
                    </button>
                    <button
                        type="button"
                        className="subtle-button"
                        disabled={submitting}
                        onClick={() =>
                            isArtworkReview
                                ? navigate(`/exhibitions/${exhibitionId}/artworks/${artworkId}`)
                                : navigate(`/exhibitions/${exhibitionId}`)
                        }
                    >
                        취소
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ReviewCreatePage;