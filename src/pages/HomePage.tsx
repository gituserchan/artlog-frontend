import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPublicReviews } from "../api/publicReviewApi";
import { getReviews } from "../api/reviewApi";
import { getStatisticsSummary } from "../api/statisticsApi";
import type { PublicReviewSimpleResponse } from "../types/publicReview";
import type { ReviewSimpleResponse } from "../types/review";
import type { StatisticsSummaryResponse } from "../types/statistics";

function HomePage() {
    const navigate = useNavigate();

    const accessToken = localStorage.getItem("accessToken");
    const isLoggedIn = !!accessToken;

    const [summary, setSummary] = useState<StatisticsSummaryResponse | null>(null);
    const [myReviews, setMyReviews] = useState<ReviewSimpleResponse[]>([]);
    const [publicReviews, setPublicReviews] = useState<PublicReviewSimpleResponse[]>(
        []
    );
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

    const formatReviewType = (reviewType: string) => {
        return reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상";
    };

    const formatCreatedAt = (createdAt: string) => {
        return createdAt.replace("T", " ").slice(0, 16);
    };

    const formatAverageRating = (averageRating: number | null) => {
        if (averageRating === null || averageRating === undefined) {
            return "-";
        }

        return `${averageRating.toFixed(1)}점`;
    };

    const fetchHomeData = async () => {
        setLoading(true);
        setMessage("");

        try {
            const publicReviewResponse = await getPublicReviews(0, 3);
            setPublicReviews(publicReviewResponse.data.content);

            if (isLoggedIn) {
                const [summaryResponse, myReviewResponse] = await Promise.all([
                    getStatisticsSummary(),
                    getReviews(0, 3),
                ]);

                setSummary(summaryResponse.data);
                setMyReviews(myReviewResponse.data.content);
            }
        } catch (error) {
            console.error(error);
            setMessage("홈 화면 정보를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, [isLoggedIn]);

    return (
        <section>
            <div
                style={{
                    padding: "56px 0 44px",
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1.2fr) minmax(280px, 0.8fr)",
                    gap: "32px",
                    alignItems: "center",
                }}
            >
                <div>
                    <p className="eyebrow">Artlog</p>
                    <h1 style={{ fontSize: "52px", lineHeight: 1.1, margin: "0 0 18px" }}>
                        전시와 작품 감상을 기록하는 나만의 아트 로그
                    </h1>
                    <p className="page-description" style={{ fontSize: "18px" }}>
                        Artlog는 관람한 전시, 인상 깊었던 작품, 감상 기록을 한곳에
                        정리하고 공개 감상을 통해 다른 사람의 관람 경험도 둘러볼 수 있는
                        기록 서비스입니다.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                            marginTop: "28px",
                        }}
                    >
                        {isLoggedIn ? (
                            <>
                                <Link to="/exhibitions/new" className="primary-link">
                                    전시 기록하기
                                </Link>
                                <Link to="/reviews" className="secondary-link">
                                    내 감상 보기
                                </Link>
                                <Link to="/statistics" className="secondary-link">
                                    통계 보기
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/signup" className="primary-link">
                                    시작하기
                                </Link>
                                <Link to="/login" className="secondary-link">
                                    로그인
                                </Link>
                                <Link to="/public-reviews" className="secondary-link">
                                    공개 감상 둘러보기
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="detail-card">
                    <p className="eyebrow">Quick guide</p>
                    <h2 style={{ marginTop: 0 }}>이렇게 사용할 수 있습니다</h2>

                    <dl className="detail-list">
                        <div>
                            <dt>1</dt>
                            <dd>관람한 전시를 기록합니다.</dd>
                        </div>

                        <div>
                            <dt>2</dt>
                            <dd>전시 속 작품을 따로 저장합니다.</dd>
                        </div>

                        <div>
                            <dt>3</dt>
                            <dd>전시 또는 작품에 대한 감상을 남깁니다.</dd>
                        </div>

                        <div>
                            <dt>4</dt>
                            <dd>공개 감상을 둘러보고 좋아요와 북마크를 남깁니다.</dd>
                        </div>
                    </dl>
                </div>
            </div>

            {message && <p className="error-text">{message}</p>}

            {loading && <p className="info-text">홈 화면 정보를 불러오는 중입니다.</p>}

            {!loading && isLoggedIn && (
                <>
                    <div className="page-title-row">
                        <div>
                            <p className="eyebrow">Dashboard</p>
                            <h1>내 기록 요약</h1>
                            <p className="page-description">
                                지금까지 쌓은 전시, 작품, 감상 기록을 한눈에 확인합니다.
                            </p>
                        </div>
                    </div>

                    <div className="card-grid" style={{ marginBottom: "36px" }}>
                        <article className="record-card">
                            <div className="record-card-body">
                                <p className="eyebrow">Exhibitions</p>
                                <h2>{summary?.exhibitionCount ?? 0}개</h2>
                                <p>내 전시 기록</p>
                            </div>
                        </article>

                        <article className="record-card">
                            <div className="record-card-body">
                                <p className="eyebrow">Artworks</p>
                                <h2>{summary?.artworkCount ?? 0}개</h2>
                                <p>내 작품 기록</p>
                            </div>
                        </article>

                        <article className="record-card">
                            <div className="record-card-body">
                                <p className="eyebrow">Reviews</p>
                                <h2>{summary?.reviewCount ?? 0}개</h2>
                                <p>내 감상 기록</p>
                            </div>
                        </article>

                        <article className="record-card">
                            <div className="record-card-body">
                                <p className="eyebrow">Average rating</p>
                                <h2>{formatAverageRating(summary?.averageRating ?? null)}</h2>
                                <p>평균 평점</p>
                            </div>
                        </article>
                    </div>
                </>
            )}

            {!loading && isLoggedIn && (
                <div style={{ marginBottom: "42px" }}>
                    <div className="page-title-row">
                        <div>
                            <p className="eyebrow">Recent reviews</p>
                            <h1>최근 내 감상</h1>
                            <p className="page-description">
                                최근 작성한 감상 기록을 빠르게 확인합니다.
                            </p>
                        </div>

                        <Link to="/reviews" className="secondary-link">
                            전체 보기
                        </Link>
                    </div>

                    {myReviews.length === 0 ? (
                        <div className="empty-box">
                            <p>아직 작성한 감상 기록이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {myReviews.map((review) => (
                                <article
                                    key={review.reviewId}
                                    className="record-card clickable-card"
                                    onClick={() => navigate(`/reviews/${review.reviewId}`)}
                                >
                                    <div className="record-card-body">
                                        <p className="eyebrow">{formatReviewType(review.reviewType)}</p>
                                        <h2>{review.title}</h2>

                                        <dl>
                                            <div>
                                                <dt>전시명</dt>
                                                <dd>{review.exhibitionTitle}</dd>
                                            </div>

                                            {review.reviewType === "ARTWORK" && (
                                                <div>
                                                    <dt>작품명</dt>
                                                    <dd>{review.artworkTitle || "-"}</dd>
                                                </div>
                                            )}

                                            <div>
                                                <dt>평점</dt>
                                                <dd>{review.rating}점</dd>
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
                </div>
            )}

            {!loading && (
                <div>
                    <div className="page-title-row">
                        <div>
                            <p className="eyebrow">Public reviews</p>
                            <h1>최근 공개 감상</h1>
                            <p className="page-description">
                                다른 사용자가 공개한 감상 기록을 둘러볼 수 있습니다.
                            </p>
                        </div>

                        <Link to="/public-reviews" className="secondary-link">
                            전체 보기
                        </Link>
                    </div>

                    {publicReviews.length === 0 ? (
                        <div className="empty-box">
                            <p>아직 공개된 감상 기록이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {publicReviews.map((review) => {
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
                                            <p className="eyebrow">
                                                {formatReviewType(review.reviewType)}
                                            </p>
                                            <h2>{review.title}</h2>
                                            <p>작성자: {review.nickname}</p>

                                            <dl>
                                                <div>
                                                    <dt>전시명</dt>
                                                    <dd>{review.exhibitionTitle}</dd>
                                                </div>

                                                {review.reviewType === "ARTWORK" && (
                                                    <div>
                                                        <dt>작품명</dt>
                                                        <dd>{review.artworkTitle || "-"}</dd>
                                                    </div>
                                                )}

                                                <div>
                                                    <dt>평점</dt>
                                                    <dd>{review.rating}점</dd>
                                                </div>

                                                <div>
                                                    <dt>좋아요</dt>
                                                    <dd>{review.likeCount}</dd>
                                                </div>

                                                <div>
                                                    <dt>북마크</dt>
                                                    <dd>{review.bookmarkCount}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default HomePage;