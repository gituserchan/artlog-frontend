import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookmarks } from "../../api/bookmarkApi";
import type { ReviewBookmarkResponse } from "../../types/bookmark";

function BookmarkListPage() {
    const navigate = useNavigate();

    const [bookmarks, setBookmarks] = useState<ReviewBookmarkResponse[]>([]);
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

    const formatReviewType = (reviewType: string) => {
        return reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상";
    };

    const formatDateTime = (dateTime: string) => {
        return dateTime.replace("T", " ").slice(0, 16);
    };

    const fetchBookmarks = async (targetPage = 0) => {
        setLoading(true);
        setMessage("");

        try {
            const response = await getMyBookmarks(targetPage, 10);

            setBookmarks(response.data.content);
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error(error);
            setMessage("북마크한 감상 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks(0);
    }, []);

    const handlePreviousPage = async () => {
        if (page <= 0) {
            return;
        }

        await fetchBookmarks(page - 1);
    };

    const handleNextPage = async () => {
        if (page + 1 >= totalPages) {
            return;
        }

        await fetchBookmarks(page + 1);
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Bookmarks</p>
                    <h1>북마크한 감상</h1>
                    <p className="page-description">
                        내가 저장한 공개 감상 기록을 다시 확인할 수 있습니다.
                    </p>
                </div>
            </div>

            {loading && (
                <p className="info-text">북마크한 감상 기록을 불러오는 중입니다.</p>
            )}

            {message && <p className="error-text">{message}</p>}

            {!loading && !message && (
                <>
                    <p className="result-count">총 {totalElements}개의 북마크</p>

                    {bookmarks.length === 0 ? (
                        <div className="empty-box">
                            <p>아직 북마크한 감상 기록이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {bookmarks.map((bookmark) => (
                                <article
                                    key={bookmark.bookmarkId}
                                    className="record-card clickable-card"
                                    onClick={() =>
                                        navigate(`/public-reviews/${bookmark.reviewId}`)
                                    }
                                >
                                    {bookmark.imageUrl && (
                                        <div className="poster-box">
                                            <img
                                                src={getImageSrc(bookmark.imageUrl)}
                                                alt={bookmark.title}
                                            />
                                        </div>
                                    )}

                                    <div className="record-card-body">
                                        <p className="eyebrow">
                                            {formatReviewType(bookmark.reviewType)}
                                        </p>

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

                                        <h2>{bookmark.title}</h2>

                                        <p>작성자: {bookmark.nickname}</p>

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
                                                        {bookmark.exhibitionTitle}
                                                    </p>
                                                </div>

                                                {bookmark.reviewType === "ARTWORK" && (
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
                                                            {bookmark.artworkTitle || "-"}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <dl>
                                            <div>
                                                <dt>평점</dt>
                                                <dd>{bookmark.rating}점</dd>
                                            </div>

                                            <div>
                                                <dt>감정 태그</dt>
                                                <dd>{bookmark.emotionTag || "-"}</dd>
                                            </div>

                                            <div>
                                                <dt>키워드</dt>
                                                <dd>{bookmark.keywords || "-"}</dd>
                                            </div>

                                            <div>
                                                <dt>북마크일</dt>
                                                <dd>{formatDateTime(bookmark.bookmarkedAt)}</dd>
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

export default BookmarkListPage;