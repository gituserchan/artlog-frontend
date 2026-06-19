import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ConfirmModal from "../../components/common/ConfirmModal";
import Toast from "../../components/common/Toast";
import { deleteReview, getReview } from "../../api/reviewApi";
import type { ReviewResponse } from "../../types/review";

function ReviewDetailPage() {
    const navigate = useNavigate();
    const params = useParams();

    const reviewId = Number(params.reviewId);

    const [review, setReview] = useState<ReviewResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState<"success" | "error" | "info">(
        "info"
    );

    const getImageSrc = (imageUrl: string) => {
        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
    };

    const formatDateTime = (dateTime: string) => {
        return dateTime.replace("T", " ").slice(0, 16);
    };

    const getErrorMessage = (error: unknown, fallbackMessage: string) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || fallbackMessage;
        }

        return fallbackMessage;
    };

    const showToast = (
        nextMessage: string,
        nextType: "success" | "error" | "info"
    ) => {
        setToastMessage(nextMessage);
        setToastType(nextType);
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
            setReview(response.data);
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error, "감상 기록을 불러오지 못했습니다."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReview();
    }, [reviewId]);

    const handleDeleteConfirm = async () => {
        if (!review) {
            return;
        }

        setDeleteLoading(true);
        setMessage("");

        try {
            await deleteReview(review.reviewId);

            setDeleteModalOpen(false);
            showToast("감상 기록이 삭제되었습니다.", "success");

            setTimeout(() => {
                navigate("/reviews");
            }, 600);
        } catch (error) {
            console.error(error);

            setDeleteModalOpen(false);
            showToast(getErrorMessage(error, "감상 기록 삭제에 실패했습니다."), "error");
        } finally {
            setDeleteLoading(false);
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
            <Toast
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage("")}
            />

            <ConfirmModal
                open={deleteModalOpen}
                title="감상 기록을 삭제할까요?"
                description="삭제한 감상 기록은 다시 복구할 수 없습니다."
                confirmText="삭제하기"
                cancelText="취소"
                danger
                loading={deleteLoading}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteModalOpen(false)}
            />

            <div className="detail-header">
                <div>
                    <p className="eyebrow">
                        {review.reviewType === "EXHIBITION"
                            ? "Exhibition review"
                            : "Artwork review"}
                    </p>
                    <h1>{review.title}</h1>
                    <p className="page-description">
                        {review.reviewType === "EXHIBITION"
                            ? review.exhibitionTitle
                            : review.artworkTitle || review.exhibitionTitle}
                    </p>
                </div>

                <div className="detail-actions">
                    <Link
                        to={`/reviews/${review.reviewId}/edit`}
                        className="secondary-link"
                    >
                        수정
                    </Link>
                    <button
                        type="button"
                        className="danger-button"
                        onClick={() => setDeleteModalOpen(true)}
                    >
                        삭제
                    </button>
                </div>
            </div>

            {review.imageUrls.length > 0 && (
                <div className="image-preview" style={{ marginBottom: "24px" }}>
                    <p>감상 이미지 {review.imageUrls.length}장</p>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                            gap: "14px",
                        }}
                    >
                        {review.imageUrls.map((imageUrl) => (
                            <img
                                key={imageUrl}
                                src={getImageSrc(imageUrl)}
                                alt="감상 이미지"
                                style={{
                                    width: "100%",
                                    height: "180px",
                                    objectFit: "cover",
                                    borderRadius: "14px",
                                    border: "1px solid #e0d7ca",
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <div className="detail-card">
                <dl className="detail-list">
                    <div>
                        <dt>구분</dt>
                        <dd>
                            {review.reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상"}
                        </dd>
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
                        <dd>{formatDateTime(review.createdAt)}</dd>
                    </div>

                    <div>
                        <dt>수정일</dt>
                        <dd>{formatDateTime(review.updatedAt)}</dd>
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
                    {review.reviewType === "ARTWORK" ? "작품 기록 보기" : "전시 기록 보기"}
                </Link>
            </div>
        </section>
    );
}

export default ReviewDetailPage;