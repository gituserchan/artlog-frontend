import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getReviews, searchReviews } from "../../api/reviewApi";
import type {
    ReviewSearchParams,
    ReviewSimpleResponse,
    ReviewType,
    ReviewVisibility,
} from "../../types/review";

function ReviewListPage() {
    const navigate = useNavigate();

    const [reviews, setReviews] = useState<ReviewSimpleResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [keyword, setKeyword] = useState("");
    const [reviewType, setReviewType] = useState("");
    const [visibility, setVisibility] = useState("");
    const [minRating, setMinRating] = useState("");
    const [maxRating, setMaxRating] = useState("");
    const [emotionTag, setEmotionTag] = useState("");
    const [keywordTag, setKeywordTag] = useState("");
    const [wantToRevisit, setWantToRevisit] = useState("");
    const [createdFrom, setCreatedFrom] = useState("");
    const [createdTo, setCreatedTo] = useState("");

    const [searchMode, setSearchMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const buildSearchParams = (): ReviewSearchParams => {
        const params: ReviewSearchParams = {};

        if (keyword.trim()) {
            params.keyword = keyword.trim();
        }

        if (reviewType) {
            params.reviewType = reviewType as ReviewType;
        }

        if (visibility) {
            params.visibility = visibility as ReviewVisibility;
        }

        if (minRating) {
            params.minRating = Number(minRating);
        }

        if (maxRating) {
            params.maxRating = Number(maxRating);
        }

        if (emotionTag.trim()) {
            params.emotionTag = emotionTag.trim();
        }

        if (keywordTag.trim()) {
            params.keywords = keywordTag.trim();
        }

        if (wantToRevisit) {
            params.wantToRevisit = wantToRevisit === "true";
        }

        if (createdFrom) {
            params.createdFrom = createdFrom;
        }

        if (createdTo) {
            params.createdTo = createdTo;
        }

        return params;
    };

    const hasSearchCondition = () => {
        const params = buildSearchParams();

        return Object.keys(params).length > 0;
    };

    const fetchReviews = async (targetPage = 0) => {
        setLoading(true);
        setMessage("");

        try {
            const response = await getReviews(targetPage, 10);

            setReviews(response.data.content);
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setSearchMode(false);
        } catch (error) {
            console.error(error);
            setMessage("감상 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSearchReviews = async (targetPage = 0) => {
        const params = buildSearchParams();

        setLoading(true);
        setMessage("");

        try {
            const response = await searchReviews(params, targetPage, 10);

            setReviews(response.data.content);
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
            setSearchMode(true);
        } catch (error) {
            console.error(error);
            setMessage("감상 기록 검색에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(0);
    }, []);

    const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!hasSearchCondition()) {
            await fetchReviews(0);
            return;
        }

        await fetchSearchReviews(0);
    };

    const handleResetSearch = async () => {
        setKeyword("");
        setReviewType("");
        setVisibility("");
        setMinRating("");
        setMaxRating("");
        setEmotionTag("");
        setKeywordTag("");
        setWantToRevisit("");
        setCreatedFrom("");
        setCreatedTo("");

        await fetchReviews(0);
    };

    const handlePreviousPage = async () => {
        if (page <= 0) {
            return;
        }

        if (searchMode) {
            await fetchSearchReviews(page - 1);
            return;
        }

        await fetchReviews(page - 1);
    };

    const handleNextPage = async () => {
        if (page + 1 >= totalPages) {
            return;
        }

        if (searchMode) {
            await fetchSearchReviews(page + 1);
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
                        내가 남긴 전시 감상과 작품 감상을 검색하고 필터링할 수 있습니다.
                    </p>
                </div>
            </div>

            <form
                className="record-form"
                onSubmit={handleSearchSubmit}
                style={{ marginBottom: "28px" }}
            >
                <div>
                    <label>통합 검색</label>
                    <input
                        value={keyword}
                        placeholder="감상 제목, 내용, 전시명 등으로 검색"
                        onChange={(event) => setKeyword(event.target.value)}
                    />
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "16px",
                    }}
                >
                    <div>
                        <label>감상 유형</label>
                        <select
                            value={reviewType}
                            onChange={(event) => setReviewType(event.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="EXHIBITION">전시 감상</option>
                            <option value="ARTWORK">작품 감상</option>
                        </select>
                    </div>

                    <div>
                        <label>공개 여부</label>
                        <select
                            value={visibility}
                            onChange={(event) => setVisibility(event.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="PRIVATE">비공개</option>
                            <option value="PUBLIC">공개</option>
                        </select>
                    </div>

                    <div>
                        <label>최소 평점</label>
                        <select
                            value={minRating}
                            onChange={(event) => setMinRating(event.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="1">1점 이상</option>
                            <option value="2">2점 이상</option>
                            <option value="3">3점 이상</option>
                            <option value="4">4점 이상</option>
                            <option value="5">5점</option>
                        </select>
                    </div>

                    <div>
                        <label>최대 평점</label>
                        <select
                            value={maxRating}
                            onChange={(event) => setMaxRating(event.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="1">1점 이하</option>
                            <option value="2">2점 이하</option>
                            <option value="3">3점 이하</option>
                            <option value="4">4점 이하</option>
                            <option value="5">5점 이하</option>
                        </select>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "16px",
                    }}
                >
                    <div>
                        <label>감정 태그</label>
                        <input
                            value={emotionTag}
                            placeholder="예: 따뜻함"
                            onChange={(event) => setEmotionTag(event.target.value)}
                        />
                    </div>

                    <div>
                        <label>키워드</label>
                        <input
                            value={keywordTag}
                            placeholder="예: 설치미술"
                            onChange={(event) => setKeywordTag(event.target.value)}
                        />
                    </div>

                    <div>
                        <label>재방문 의향</label>
                        <select
                            value={wantToRevisit}
                            onChange={(event) => setWantToRevisit(event.target.value)}
                        >
                            <option value="">전체</option>
                            <option value="true">있음</option>
                            <option value="false">없음</option>
                        </select>
                    </div>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                        gap: "16px",
                    }}
                >
                    <div>
                        <label>작성 시작일</label>
                        <input
                            type="date"
                            value={createdFrom}
                            onChange={(event) => setCreatedFrom(event.target.value)}
                        />
                    </div>

                    <div>
                        <label>작성 종료일</label>
                        <input
                            type="date"
                            value={createdTo}
                            onChange={(event) => setCreatedTo(event.target.value)}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        검색
                    </button>

                    <button
                        type="button"
                        className="subtle-button"
                        disabled={loading}
                        onClick={handleResetSearch}
                    >
                        초기화
                    </button>
                </div>
            </form>

            {loading && <p className="info-text">감상 기록을 불러오는 중입니다.</p>}

            {message && <p className="error-text">{message}</p>}

            {!loading && !message && (
                <>
                    <p className="result-count">
                        {searchMode ? "검색 결과" : "전체 감상"} 총 {totalElements}개
                    </p>

                    {reviews.length === 0 ? (
                        <div className="empty-box">
                            <p>
                                {searchMode
                                    ? "검색 조건에 맞는 감상 기록이 없습니다."
                                    : "아직 작성한 감상 기록이 없습니다."}
                            </p>
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