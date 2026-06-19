import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicReviews } from "../../api/publicReviewApi";
import type { PublicReviewSimpleResponse } from "../../types/publicReview";

function PublicReviewListPage() {
    const navigate = useNavigate();

    const [reviews, setReviews] = useState<PublicReviewSimpleResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const getImageSrc = (imageUrl: string) => {
        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
    };

    const getRepresentativeImageUrl = (review: PublicReviewSimpleResponse) => {
        if (!review.imageUrls || review.imageUrls.length === 0) {
            return null;
        }

        return review.imageUrls[0];
    };

    const formatReviewType = (review: PublicReviewSimpleResponse) => {
        return review.reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상";
    };

    const formatCreatedAt = (createdAt: string) => {
        return createdAt.replace("T", " ").slice(0, 16);
    };

    const fetchPublicReviews = async (targetPage = 0) => {
        setLoading(true);
        setMessage("");

        try {
            const response = await getPublicReviews(targetPage, 10);

            setReviews(response.data.content);
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error(error);
            setMessage("공개 감상 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicReviews(0);
    }, []);

    const handlePreviousPage = async () => {
        if (page <= 0) {
            return;
        }

        await fetchPublicReviews(page - 1);
    };

    const handleNextPage = async () => {
        if (page + 1 >= totalPages) {
            return;
        }

        await fetchPublicReviews(page + 1);
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Public reviews</p>
                    <h1>공개 감상</h1>
                    <p className="page-description">
                        다른 사용자가 공개한 전시 감상과 작품 감상을 둘러볼 수 있습니다.
                    </p>
                </div>
            </div>

            {loading && <p className="info-text">공개 감상을 불러오는 중입니다.</p>}

            {message && <p className="error-text">{message}</p>}

            {!loading && !message && (
                <>
                    <p className="result-count">총 {totalElements}개의 공개 감상</p>

                    {reviews.length === 0 ? (
                        <div className="empty-box">
                            <p>아직 공개된 감상 기록이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {reviews.map((review) => {
                                const representativeImageUrl = getRepresentativeImageUrl(review);

                                return (
                                    <article
                                        key={review.reviewId}
                                        className="record-card clickable-card"
                                        onClick={() => navigate(`/public-reviews/${review.reviewId}`)}
                                    >
                                        {representativeImageUrl && (
                                            <div className="poster-box">
                                                <img
                                                    src={getImageSrc(representativeImageUrl)}
                                                    alt={review.title}
                                                />
                                            </div>
                                        )}

                                        <div className="record-card-body">
                                            <p className="eyebrow">{formatReviewType(review)}</p>

                                            <h2>{review.title}</h2>

                                            <p>작성자: {review.nickname}</p>

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
                                                    <dt>이미지</dt>
                                                    <dd>{review.imageUrls.length}장</dd>
                                                </div>

                                                <div>
                                                    <dt>좋아요</dt>
                                                    <dd>{review.likeCount}</dd>
                                                </div>

                                                <div>
                                                    <dt>북마크</dt>
                                                    <dd>{review.bookmarkCount}</dd>
                                                </div>

                                                <div>
                                                    <dt>작성일</dt>
                                                    <dd>{formatCreatedAt(review.createdAt)}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </article>
                                );
                            })}
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

export default PublicReviewListPage;