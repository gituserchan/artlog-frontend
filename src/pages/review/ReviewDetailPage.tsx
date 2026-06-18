import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { deleteReview, getReview } from "../../api/reviewApi";
import type { ReviewResponse } from "../../types/review";

function ReviewDetailPage() {
    const navigate = useNavigate();
    const params = useParams();

    const reviewId = Number(params.reviewId);

    const [review, setReview] = useState<ReviewResponse | null>(null);
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
            setReview(response.data);
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

    const handleDelete = async () => {
        if (!review) {
            return;
        }

        const confirmed = window.confirm("이 감상 기록을 삭제하시겠습니까?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteReview(review.reviewId);

            alert("감상 기록이 삭제되었습니다.");
            navigate("/reviews");
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "감상 기록 삭제에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("감상 기록 삭제에 실패했습니다.");
        }
    };

    if (loading) {
        return <p className="info-text">감상 기록을 불러오는 중입니다.</p>;
    }

    if (message) {
        return <p className="error-text">{message}</p>;
    }

    if (!review) {
        return <p className="info-text">감상 기록이 없습니다.</p>;
    }

    return (
        <section>
            <div className="detail-header">
                <div>
                    <p className="eyebrow">
                        {review.reviewType === "EXHIBITION" ? "Exhibition review" : "Artwork review"}
                    </p>
                    <h1>{review.title}</h1>
                    <p className="page-description">
                        {review.reviewType === "EXHIBITION"
                            ? review.exhibitionTitle
                            : review.artworkTitle || review.exhibitionTitle}
                    </p>
                </div>

                <div className="detail-actions">
                    <Link to={`/reviews/${review.reviewId}/edit`} className="secondary-link">
                        수정
                    </Link>
                    <button type="button" className="danger-button" onClick={handleDelete}>
                        삭제
                    </button>
                </div>
            </div>

            <div className="detail-card">
                <dl className="detail-list">
                    <div>
                        <dt>구분</dt>
                        <dd>{review.reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상"}</dd>
                    </div>

                    <div>
                        <dt>공개 여부</dt>
                        <dd>{review.visibility === "PUBLIC" ? "공개" : "비공개"}</dd>
                    </div>

                    <div>
                        <dt>평점</dt>
                        <dd>{review.rating}점</dd>
                    </div>

                    <div>
                        <dt>감정 태그</dt>
                        <dd>{review.emotionTag || "-"}</dd>
                    </div>

                    <div>
                        <dt>키워드</dt>
                        <dd>{review.keywords || "-"}</dd>
                    </div>

                    <div>
                        <dt>재방문 의향</dt>
                        <dd>{review.wantToRevisit ? "있음" : "없음"}</dd>
                    </div>

                    <div>
                        <dt>작성일</dt>
                        <dd>{review.createdAt}</dd>
                    </div>

                    <div>
                        <dt>수정일</dt>
                        <dd>{review.updatedAt}</dd>
                    </div>
                </dl>

                <div className="memo-box">
                    <h2>감상 내용</h2>
                    <p>{review.content}</p>
                </div>
            </div>

            <div className="bottom-actions">
                <Link to="/reviews" className="secondary-link">
                    감상 목록으로
                </Link>

                <Link
                    to={
                        review.reviewType === "ARTWORK" && review.artworkId
                            ? `/exhibitions/${review.exhibitionId}/artworks/${review.artworkId}`
                            : `/exhibitions/${review.exhibitionId}`
                    }
                    className="primary-link"
                >
                    원본 기록으로
                </Link>
            </div>
        </section>
    );
}

export default ReviewDetailPage;