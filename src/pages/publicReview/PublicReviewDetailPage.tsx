import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
    bookmarkReview,
    getPublicReview,
    likeReview,
    unbookmarkReview,
    unlikeReview,
} from "../../api/publicReviewApi";
import type { PublicReviewResponse } from "../../types/publicReview";

function PublicReviewDetailPage() {
    const params = useParams();

    const reviewId = Number(params.reviewId);

    const [review, setReview] = useState<PublicReviewResponse | null>(null);
    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarkCount, setBookmarkCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [message, setMessage] = useState("");

    const getImageSrc = (imageUrl: string) => {
        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
    };

    const formatCreatedAt = (createdAt: string) => {
        return createdAt.replace("T", " ").slice(0, 16);
    };

    const formatReviewType = (targetReview: PublicReviewResponse) => {
        return targetReview.reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상";
    };

    const getRecordLink = (targetReview: PublicReviewResponse) => {
        if (targetReview.reviewType === "ARTWORK" && targetReview.artworkId) {
            return `/exhibitions/${targetReview.exhibitionId}/artworks/${targetReview.artworkId}`;
        }

        return `/exhibitions/${targetReview.exhibitionId}`;
    };

    const getRecordLinkText = (targetReview: PublicReviewResponse) => {
        return targetReview.reviewType === "ARTWORK"
            ? "작품 기록 보기"
            : "전시 기록 보기";
    };

    const getErrorMessage = (error: unknown, fallbackMessage: string) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || fallbackMessage;
        }

        return fallbackMessage;
    };

    const fetchPublicReview = async () => {
        if (!reviewId || Number.isNaN(reviewId)) {
            setMessage("올바르지 않은 공개 감상입니다.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await getPublicReview(reviewId);

            setReview(response.data);
            setLikeCount(response.data.likeCount);
            setBookmarkCount(response.data.bookmarkCount);
            setLiked(response.data.likedByMe);
            setBookmarked(response.data.bookmarkedByMe);
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error, "공개 감상을 불러오지 못했습니다."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicReview();
    }, [reviewId]);

    const handleLikeClick = async () => {
        if (!review || likeLoading) {
            return;
        }

        setLikeLoading(true);
        setMessage("");

        try {
            if (liked) {
                await unlikeReview(review.reviewId);

                setLiked(false);
                setLikeCount((prevCount) => Math.max(prevCount - 1, 0));
                return;
            }

            await likeReview(review.reviewId);

            setLiked(true);
            setLikeCount((prevCount) => prevCount + 1);
        } catch (error) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "좋아요 처리에 실패했습니다. 로그인이 필요할 수 있습니다."
                )
            );
        } finally {
            setLikeLoading(false);
        }
    };

    const handleBookmarkClick = async () => {
        if (!review || bookmarkLoading) {
            return;
        }

        setBookmarkLoading(true);
        setMessage("");

        try {
            if (bookmarked) {
                await unbookmarkReview(review.reviewId);

                setBookmarked(false);
                setBookmarkCount((prevCount) => Math.max(prevCount - 1, 0));
                return;
            }

            await bookmarkReview(review.reviewId);

            setBookmarked(true);
            setBookmarkCount((prevCount) => prevCount + 1);
        } catch (error) {
            console.error(error);

            setMessage(
                getErrorMessage(
                    error,
                    "북마크 처리에 실패했습니다. 로그인이 필요할 수 있습니다."
                )
            );
        } finally {
            setBookmarkLoading(false);
        }
    };

    if (loading) {
        return <p className="info-text">공개 감상을 불러오는 중입니다.</p>;
    }

    if (message && !review) {
        return <p className="error-text">{message}</p>;
    }

    if (!review) {
        return <p className="info-text">공개 감상이 없습니다.</p>;
    }

    return (
        <section>
            <div className="detail-header">
                <div>
                    <p className="eyebrow">{formatReviewType(review)}</p>
                    <h1>{review.title}</h1>
                    <p className="page-description">
                        {review.nickname}님의 공개 감상입니다.
                    </p>
                </div>

                <div className="detail-actions">
                    <button
                        type="button"
                        className={liked ? "primary-link" : "subtle-button"}
                        disabled={likeLoading}
                        onClick={handleLikeClick}
                    >
                        {liked ? "좋아요 취소" : "좋아요"} {likeCount}
                    </button>

                    <button
                        type="button"
                        className={bookmarked ? "primary-link" : "subtle-button"}
                        disabled={bookmarkLoading}
                        onClick={handleBookmarkClick}
                    >
                        {bookmarked ? "북마크 취소" : "북마크"} {bookmarkCount}
                    </button>
                </div>
            </div>

            {message && <p className="error-text">{message}</p>}

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
                        <dt>작성자</dt>
                        <dd>{review.nickname}</dd>
                    </div>

                    <div>
                        <dt>구분</dt>
                        <dd>
                            {review.reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상"}
                        </dd>
                    </div>

                    <div>
                        <dt>전시명</dt>
                        <dd>{review.exhibitionTitle}</dd>
                    </div>

                    <div>
                        <dt>미술관 / 전시장</dt>
                        <dd>{review.museumName}</dd>
                    </div>

                    {review.reviewType === "ARTWORK" && (
                        <>
                            <div>
                                <dt>작품명</dt>
                                <dd>{review.artworkTitle || "-"}</dd>
                            </div>

                            <div>
                                <dt>작가</dt>
                                <dd>{review.artistName || "작가 미상"}</dd>
                            </div>
                        </>
                    )}

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
                        <dt>이미지</dt>
                        <dd>{review.imageUrls.length}장</dd>
                    </div>

                    <div>
                        <dt>좋아요</dt>
                        <dd>{likeCount}</dd>
                    </div>

                    <div>
                        <dt>북마크</dt>
                        <dd>{bookmarkCount}</dd>
                    </div>

                    <div>
                        <dt>작성일</dt>
                        <dd>{formatCreatedAt(review.createdAt)}</dd>
                    </div>

                    <div>
                        <dt>수정일</dt>
                        <dd>{formatCreatedAt(review.updatedAt)}</dd>
                    </div>
                </dl>

                <div className="memo-box">
                    <h2>감상 내용</h2>
                    <p>{review.content}</p>
                </div>
            </div>

            <div className="bottom-actions">
                <Link to="/public-reviews" className="secondary-link">
                    공개 감상 목록으로
                </Link>

                <Link to={getRecordLink(review)} className="primary-link">
                    {getRecordLinkText(review)}
                </Link>
            </div>
        </section>
    );
}

export default PublicReviewDetailPage;