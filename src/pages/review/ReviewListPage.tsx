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
                                        <p className="eyebrow">
                                            {review.reviewType === "EXHIBITION"
                                                ? "전시 감상"
                                                : "작품 감상"}
                                        </p>

                                        <h2>{review.title}</h2>

                                        <p>
                                            {review.reviewType === "EXHIBITION"
                                                ? review.exhibitionTitle
                                                : review.artworkTitle || review.exhibitionTitle}
                                        </p>

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