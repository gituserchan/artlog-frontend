import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [visibility, setVisibility] = useState<ReviewVisibility>("PRIVATE");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

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
            setImageUrl(review.imageUrl);
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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!reviewId || Number.isNaN(reviewId)) {
            setMessage("올바르지 않은 감상 기록입니다.");
            return;
        }

        setMessage("");

        try {
            const response = await updateReview(reviewId, {
                title,
                content,
                rating,
                emotionTag,
                keywords,
                wantToRevisit,
                imageUrl,
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
                        작성한 감상 제목, 내용, 평점, 공개 여부를 수정할 수 있습니다.
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
                    <button type="submit">수정하기</button>
                    <button
                        type="button"
                        className="subtle-button"
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