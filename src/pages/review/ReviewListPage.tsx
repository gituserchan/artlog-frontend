import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReviews } from "../../api/reviewApi";
import type { ReviewSimpleResponse } from "../../types/review";

function ReviewListPage() {
    const navigate = useNavigate();

    const [reviews, setReviews] = useState<ReviewSimpleResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchReviews = async (targetPage = 0) => {
        setLoading(true);
        setMessage("");

        try {
            const response = await getReviews(targetPage, 10);

            setReviews(response.data.content);
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error(error);
            setMessage("감상 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(0);
    }, []);

    const handlePreviousPage = async () => {
        if (page <= 0) {
            return;
        }

        await fetchReviews(page - 1);
    };

    const handleNextPage = async () => {
        if (page + 1 >= totalPages) {
            return;
        }

        await fetchReviews(page + 1);
    };

    const formatReviewType = (review: ReviewSimpleResponse) => {
        return review.reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상";
    };

    const formatCreatedAt = (createdAt: string) => {
        return createdAt.replace("T", " ").slice(0, 16);
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">My reviews</p>
                    <h1>내 감상 기록</h1>
                    <p className="page-description">
                        내가 남긴 전시 감상과 작품 감상을 한 번에 모아볼 수 있습니다.
                    </p>
                </div>
            </div>

            {loading && <p className="info-text">감상 기록을 불러오는 중입니다.</p>}

            {message && <p className="error-text">{message}</p>}

            {!loading && !message && (
                <>
                    <p className="result-count">총 {totalElements}개의 감상 기록</p>

                    {reviews.length === 0 ? (
                        <div className="empty-box">
                            <p>아직 작성한 감상 기록이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {reviews.map((review) => (
                                <article
                                    key={review.reviewId}
                                    className="record-card clickable-card"
                                    onClick={() => navigate(`/reviews/${review.reviewId}`)}
                                >
                                    <div className="record-card-body">
                                        <p className="eyebrow">{formatReviewType(review)}</p>

                                        <p
                                            style={{
                                                margin: "0 0 6px",
                                                color: "#8a7b68",
                                                fontSize: "13px",
                                                fontWeight: 800,
                                            }}
                                        >
                                            감상 제목
                                        </p>

                                        <h2>{review.title}</h2>

                                        <div
                                            style={{
                                                marginTop: "18px",
                                                padding: "14px",
                                                border: "1px solid #e0d7ca",
                                                borderRadius: "14px",
                                                background: "#f7f0e6",
                                            }}
                                        >
                                            <p
                                                style={{
                                                    margin: "0 0 10px",
                                                    color: "#8a6f4d",
                                                    fontSize: "13px",
                                                    fontWeight: 900,
                                                }}
                                            >
                                                감상 대상
                                            </p>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "8px",
                                                }}
                                            >
                                                <div>
                                                    <p
                                                        style={{
                                                            margin: 0,
                                                            color: "#8a7b68",
                                                            fontSize: "12px",
                                                            fontWeight: 800,
                                                        }}
                                                    >
                                                        전시명
                                                    </p>
                                                    <p
                                                        style={{
                                                            margin: "3px 0 0",
                                                            color: "#2f2a24",
                                                            fontSize: "16px",
                                                            fontWeight: 800,
                                                            lineHeight: 1.4,
                                                        }}
                                                    >
                                                        {review.exhibitionTitle}
                                                    </p>
                                                </div>

                                                {review.reviewType === "ARTWORK" && (
                                                    <div>
                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                color: "#8a7b68",
                                                                fontSize: "12px",
                                                                fontWeight: 800,
                                                            }}
                                                        >
                                                            작품명
                                                        </p>
                                                        <p
                                                            style={{
                                                                margin: "3px 0 0",
                                                                color: "#2f2a24",
                                                                fontSize: "16px",
                                                                fontWeight: 800,
                                                                lineHeight: 1.4,
                                                            }}
                                                        >
                                                            {review.artworkTitle || "-"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <dl>
                                            <div>
                                                <dt>평점</dt>
                                                <dd>{review.rating}점</dd>
                                            </div>

                                            <div>
                                                <dt>감정 태그</dt>
                                                <dd>{review.emotionTag || "-"}</dd>
                                            </div>

                                            <div>
                                                <dt>재방문 의향</dt>
                                                <dd>{review.wantToRevisit ? "있음" : "없음"}</dd>
                                            </div>

                                            <div>
                                                <dt>작성일</dt>
                                                <dd>{formatCreatedAt(review.createdAt)}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    <div className="pagination">
                        <button
                            type="button"
                            className="subtle-button"
                            disabled={page <= 0}
                            onClick={handlePreviousPage}
                        >
                            이전
                        </button>

                        <span>
              {totalPages === 0 ? 0 : page + 1} / {totalPages}
            </span>

                        <button
                            type="button"
                            className="subtle-button"
                            disabled={page + 1 >= totalPages}
                            onClick={handleNextPage}
                        >
                            다음
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default ReviewListPage;