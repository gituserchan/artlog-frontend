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
import {
    createReviewComment,
    deleteReviewComment,
    getReviewComments,
} from "../../api/reviewCommentApi";
import type { PublicReviewResponse } from "../../types/publicReview";
import type { ReviewCommentResponse } from "../../types/reviewComment";

function PublicReviewDetailPage() {
    const params = useParams();

    const reviewId = Number(params.reviewId);
    const accessToken = localStorage.getItem("accessToken");
    const isLoggedIn = !!accessToken;

    const [review, setReview] = useState<PublicReviewResponse | null>(null);
    const [comments, setComments] = useState<ReviewCommentResponse[]>([]);
    const [commentContent, setCommentContent] = useState("");

    const [liked, setLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarkCount, setBookmarkCount] = useState(0);

    const [loading, setLoading] = useState(false);
    const [commentLoading, setCommentLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const [bookmarkLoading, setBookmarkLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [commentMessage, setCommentMessage] = useState("");

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

    const fetchComments = async () => {
        if (!reviewId || Number.isNaN(reviewId)) {
            return;
        }

        setCommentMessage("");

        try {
            const response = await getReviewComments(reviewId);
            setComments(response.data);
        } catch (error) {
            console.error(error);
            setCommentMessage(
                getErrorMessage(error, "댓글 목록을 불러오지 못했습니다.")
            );
        }
    };

    useEffect(() => {
        fetchPublicReview();
        fetchComments();
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

    const handleCommentSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!review) {
            return;
        }

        if (!commentContent.trim()) {
            setCommentMessage("댓글 내용을 입력해주세요.");
            return;
        }

        if (commentContent.trim().length > 500) {
            setCommentMessage("댓글은 500자 이하로 입력해주세요.");
            return;
        }

        setCommentLoading(true);
        setCommentMessage("");

        try {
            const response = await createReviewComment(review.reviewId, {
                content: commentContent.trim(),
            });

            setComments((prevComments) => [...prevComments, response.data]);
            setCommentContent("");
        } catch (error) {
            console.error(error);

            setCommentMessage(
                getErrorMessage(
                    error,
                    "댓글 작성에 실패했습니다. 로그인이 필요할 수 있습니다."
                )
            );
        } finally {
            setCommentLoading(false);
        }
    };

    const handleCommentDelete = async (commentId: number) => {
        if (!review || commentLoading) {
            return;
        }

        const confirmed = window.confirm("댓글을 삭제할까요?");

        if (!confirmed) {
            return;
        }

        setCommentLoading(true);
        setCommentMessage("");

        try {
            await deleteReviewComment(review.reviewId, commentId);

            setComments((prevComments) =>
                prevComments.filter((comment) => comment.commentId !== commentId)
            );
        } catch (error) {
            console.error(error);

            setCommentMessage(getErrorMessage(error, "댓글 삭제에 실패했습니다."));
        } finally {
            setCommentLoading(false);
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

            <div className="detail-card" style={{ marginTop: "28px" }}>
                <div className="page-title-row" style={{ marginBottom: "20px" }}>
                    <div>
                        <p className="eyebrow">Comments</p>
                        <h1 style={{ fontSize: "30px" }}>댓글 {comments.length}개</h1>
                        <p className="page-description">
                            공개 감상에 대한 의견을 남길 수 있습니다.
                        </p>
                    </div>
                </div>

                {commentMessage && <p className="error-text">{commentMessage}</p>}

                {isLoggedIn ? (
                    <form
                        className="record-form"
                        style={{ maxWidth: "100%", marginBottom: "24px" }}
                        onSubmit={handleCommentSubmit}
                    >
                        <div>
                            <label>댓글 작성</label>
                            <textarea
                                value={commentContent}
                                maxLength={500}
                                placeholder="댓글을 입력하세요."
                                onChange={(event) => setCommentContent(event.target.value)}
                            />
                            <p className="page-description">
                                {commentContent.length} / 500자
                            </p>
                        </div>

                        <div className="form-actions">
                            <button type="submit" disabled={commentLoading}>
                                {commentLoading ? "작성 중..." : "댓글 작성"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="empty-box" style={{ marginBottom: "24px" }}>
                        <p>댓글을 작성하려면 로그인이 필요합니다.</p>
                        <Link to="/login" className="primary-link" style={{ marginTop: "12px" }}>
                            로그인하기
                        </Link>
                    </div>
                )}

                {comments.length === 0 ? (
                    <div className="empty-box">
                        <p>아직 작성된 댓글이 없습니다.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {comments.map((comment) => (
                            <article
                                key={comment.commentId}
                                style={{
                                    padding: "18px",
                                    border: "1px solid #e0d7ca",
                                    borderRadius: "16px",
                                    background: "#fffaf2",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "16px",
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <div>
                                        <p className="eyebrow" style={{ marginBottom: "6px" }}>
                                            {comment.nickname}
                                            {comment.writtenByMe ? " · 내 댓글" : ""}
                                        </p>
                                        <p
                                            style={{
                                                margin: 0,
                                                color: "#4f4840",
                                                lineHeight: 1.7,
                                                whiteSpace: "pre-wrap",
                                            }}
                                        >
                                            {comment.content}
                                        </p>
                                        <p className="page-description">
                                            {formatCreatedAt(comment.createdAt)}
                                        </p>
                                    </div>

                                    {comment.writtenByMe && (
                                        <button
                                            type="button"
                                            className="danger-button"
                                            disabled={commentLoading}
                                            onClick={() => handleCommentDelete(comment.commentId)}
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
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