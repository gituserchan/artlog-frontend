import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchReviews } from "../../api/reviewApi";
import type { ReviewSimpleResponse } from "../../types/review";

function ReviewCalendarPage() {
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [reviews, setReviews] = useState<ReviewSimpleResponse[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const formatMonthTitle = (date: Date) => {
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    };

    const monthStartDate = useMemo(() => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    }, [currentDate]);

    const monthEndDate = useMemo(() => {
        return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }, [currentDate]);

    const monthStartDateString = formatDate(monthStartDate);
    const monthEndDateString = formatDate(monthEndDate);

    const reviewsByDate = useMemo(() => {
        return reviews.reduce<Record<string, ReviewSimpleResponse[]>>(
            (acc, review) => {
                const dateKey = review.createdAt.slice(0, 10);

                if (!acc[dateKey]) {
                    acc[dateKey] = [];
                }

                acc[dateKey].push(review);

                return acc;
            },
            {}
        );
    }, [reviews]);

    const calendarCells = useMemo(() => {
        const firstDayOfMonth = monthStartDate.getDay();
        const lastDateOfMonth = monthEndDate.getDate();

        const cells: Array<{
            key: string;
            date: string | null;
            day: number | null;
            reviews: ReviewSimpleResponse[];
        }> = [];

        for (let index = 0; index < firstDayOfMonth; index += 1) {
            cells.push({
                key: `empty-${index}`,
                date: null,
                day: null,
                reviews: [],
            });
        }

        for (let day = 1; day <= lastDateOfMonth; day += 1) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                day
            );
            const dateString = formatDate(date);

            cells.push({
                key: dateString,
                date: dateString,
                day,
                reviews: reviewsByDate[dateString] || [],
            });
        }

        return cells;
    }, [currentDate, monthStartDate, monthEndDate, reviewsByDate]);

    const selectedReviews = selectedDate ? reviewsByDate[selectedDate] || [] : [];

    const fetchCalendarReviews = async () => {
        setLoading(true);
        setMessage("");

        try {
            const response = await searchReviews(
                {
                    createdFrom: monthStartDateString,
                    createdTo: monthEndDateString,
                },
                0,
                100
            );

            setReviews(response.data.content);

            const todayString = formatDate(new Date());

            if (
                todayString >= monthStartDateString &&
                todayString <= monthEndDateString
            ) {
                setSelectedDate(todayString);
                return;
            }

            setSelectedDate(monthStartDateString);
        } catch (error) {
            console.error(error);
            setMessage("캘린더 감상 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendarReviews();
    }, [monthStartDateString, monthEndDateString]);

    const handlePreviousMonth = () => {
        setCurrentDate(
            (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
        );
    };

    const handleNextMonth = () => {
        setCurrentDate(
            (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
        );
    };

    const handleTodayClick = () => {
        const today = new Date();

        setCurrentDate(today);
        setSelectedDate(formatDate(today));
    };

    const formatReviewType = (review: ReviewSimpleResponse) => {
        return review.reviewType === "EXHIBITION" ? "전시 감상" : "작품 감상";
    };

    const formatCreatedAt = (createdAt: string) => {
        return createdAt.replace("T", " ").slice(0, 16);
    };

    const isToday = (date: string | null) => {
        if (!date) {
            return false;
        }

        return date === formatDate(new Date());
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Review calendar</p>
                    <h1>감상 캘린더</h1>
                    <p className="page-description">
                        내가 작성한 감상 기록을 날짜별로 확인할 수 있습니다.
                    </p>
                </div>

                <div className="detail-actions">
                    <button
                        type="button"
                        className="subtle-button"
                        onClick={handleTodayClick}
                    >
                        오늘
                    </button>

                    <button
                        type="button"
                        className="subtle-button"
                        onClick={handlePreviousMonth}
                    >
                        이전 달
                    </button>

                    <button
                        type="button"
                        className="subtle-button"
                        onClick={handleNextMonth}
                    >
                        다음 달
                    </button>
                </div>
            </div>

            <div className="detail-card" style={{ marginBottom: "28px" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "16px",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div>
                        <p className="eyebrow">Month</p>
                        <h2 style={{ margin: 0 }}>{formatMonthTitle(currentDate)}</h2>
                    </div>

                    <p className="result-count" style={{ margin: 0 }}>
                        이번 달 감상 {reviews.length}개
                    </p>
                </div>

                {loading && <p className="info-text">감상 기록을 불러오는 중입니다.</p>}

                {message && <p className="error-text">{message}</p>}

                {!loading && !message && (
                    <>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                                gap: "8px",
                                marginBottom: "8px",
                            }}
                        >
                            {["일", "월", "화", "수", "목", "금", "토"].map((dayName) => (
                                <div
                                    key={dayName}
                                    style={{
                                        padding: "10px 0",
                                        textAlign: "center",
                                        color: "#8a7b68",
                                        fontSize: "13px",
                                        fontWeight: 900,
                                    }}
                                >
                                    {dayName}
                                </div>
                            ))}
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                                gap: "8px",
                            }}
                        >
                            {calendarCells.map((cell) => {
                                const isSelected = cell.date === selectedDate;
                                const hasReviews = cell.reviews.length > 0;

                                return (
                                    <button
                                        key={cell.key}
                                        type="button"
                                        disabled={!cell.date}
                                        onClick={() => {
                                            if (cell.date) {
                                                setSelectedDate(cell.date);
                                            }
                                        }}
                                        style={{
                                            minHeight: "92px",
                                            padding: "10px",
                                            borderRadius: "16px",
                                            border: isSelected
                                                ? "2px solid #2f2a24"
                                                : "1px solid #e0d7ca",
                                            background: cell.date ? "#fffaf2" : "transparent",
                                            color: "#2f2a24",
                                            cursor: cell.date ? "pointer" : "default",
                                            opacity: cell.date ? 1 : 0.35,
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            justifyContent: "space-between",
                                        }}
                                    >
                    <span
                        style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "999px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: isToday(cell.date)
                                ? "#2f2a24"
                                : "transparent",
                            color: isToday(cell.date) ? "white" : "#2f2a24",
                            fontWeight: 900,
                        }}
                    >
                      {cell.day || ""}
                    </span>

                                        {cell.date && (
                                            <span
                                                style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    minHeight: "26px",
                                                    padding: "0 9px",
                                                    borderRadius: "999px",
                                                    background: hasReviews ? "#f0dfc4" : "#f7f0e6",
                                                    color: hasReviews ? "#2f2a24" : "#8a7b68",
                                                    fontSize: "12px",
                                                    fontWeight: 900,
                                                }}
                                            >
                        {hasReviews ? `${cell.reviews.length}개` : "기록 없음"}
                      </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Selected date</p>
                    <h1>{selectedDate || "날짜 선택"}</h1>
                    <p className="page-description">
                        선택한 날짜에 작성한 감상 기록입니다.
                    </p>
                </div>
            </div>

            {selectedReviews.length === 0 ? (
                <div className="empty-box">
                    <p>선택한 날짜에 작성한 감상 기록이 없습니다.</p>
                </div>
            ) : (
                <div className="card-grid">
                    {selectedReviews.map((review) => (
                        <article
                            key={review.reviewId}
                            className="record-card clickable-card"
                            onClick={() => navigate(`/reviews/${review.reviewId}`)}
                        >
                            <div className="record-card-body">
                                <p className="eyebrow">{formatReviewType(review)}</p>
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
                                        <dt>감정 태그</dt>
                                        <dd>{review.emotionTag || "-"}</dd>
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
        </section>
    );
}

export default ReviewCalendarPage;