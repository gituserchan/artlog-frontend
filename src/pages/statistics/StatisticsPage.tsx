import { useEffect, useState } from "react";
import axios from "axios";
import {
    getMonthlyVisits,
    getRatingDistribution,
    getStatisticsSummary,
    getTopEmotionTags,
    getTopMuseums,
} from "../../api/statisticsApi";
import type {
    MonthlyVisitResponse,
    RatingDistributionResponse,
    StatisticsSummaryResponse,
    TopEmotionTagResponse,
    TopMuseumResponse,
} from "../../types/statistics";

function StatisticsPage() {
    const [summary, setSummary] = useState<StatisticsSummaryResponse | null>(null);
    const [monthlyVisits, setMonthlyVisits] = useState<MonthlyVisitResponse[]>([]);
    const [topMuseums, setTopMuseums] = useState<TopMuseumResponse[]>([]);
    const [ratingDistribution, setRatingDistribution] = useState<
        RatingDistributionResponse[]
    >([]);
    const [topEmotionTags, setTopEmotionTags] = useState<TopEmotionTagResponse[]>(
        []
    );

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const getErrorMessage = (error: unknown, fallbackMessage: string) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || fallbackMessage;
        }

        return fallbackMessage;
    };

    const getMaxCount = (items: { count: number }[]) => {
        if (items.length === 0) {
            return 0;
        }

        return Math.max(...items.map((item) => item.count));
    };

    const getBarWidth = (count: number, maxCount: number) => {
        if (maxCount === 0) {
            return "0%";
        }

        return `${Math.max((count / maxCount) * 100, 4)}%`;
    };

    const formatAverageRating = (averageRating: number | null) => {
        if (averageRating === null || averageRating === undefined) {
            return "-";
        }

        return `${averageRating.toFixed(1)}점`;
    };

    const fetchStatistics = async () => {
        setLoading(true);
        setMessage("");

        try {
            const [
                summaryResponse,
                monthlyVisitsResponse,
                topMuseumsResponse,
                ratingDistributionResponse,
                topEmotionTagsResponse,
            ] = await Promise.all([
                getStatisticsSummary(),
                getMonthlyVisits(),
                getTopMuseums(),
                getRatingDistribution(),
                getTopEmotionTags(),
            ]);

            setSummary(summaryResponse.data);
            setMonthlyVisits(monthlyVisitsResponse.data);
            setTopMuseums(topMuseumsResponse.data);
            setRatingDistribution(ratingDistributionResponse.data);
            setTopEmotionTags(topEmotionTagsResponse.data);
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error, "통계 정보를 불러오지 못했습니다."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    const monthlyMaxCount = getMaxCount(monthlyVisits);
    const museumMaxCount = getMaxCount(topMuseums);
    const ratingMaxCount = getMaxCount(ratingDistribution);
    const emotionTagMaxCount = getMaxCount(topEmotionTags);

    if (loading) {
        return <p className="info-text">통계 정보를 불러오는 중입니다.</p>;
    }

    if (message) {
        return <p className="error-text">{message}</p>;
    }

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Statistics</p>
                    <h1>나의 감상 통계</h1>
                    <p className="page-description">
                        내가 기록한 전시, 작품, 감상 데이터를 기준으로 관람 습관을
                        확인합니다.
                    </p>
                </div>
            </div>

            <div className="card-grid" style={{ marginBottom: "28px" }}>
                <article className="record-card">
                    <div className="record-card-body">
                        <p className="eyebrow">Exhibitions</p>
                        <h2>{summary?.exhibitionCount ?? 0}개</h2>
                        <p>기록한 전시 수</p>
                    </div>
                </article>

                <article className="record-card">
                    <div className="record-card-body">
                        <p className="eyebrow">Artworks</p>
                        <h2>{summary?.artworkCount ?? 0}개</h2>
                        <p>기록한 작품 수</p>
                    </div>
                </article>

                <article className="record-card">
                    <div className="record-card-body">
                        <p className="eyebrow">Reviews</p>
                        <h2>{summary?.reviewCount ?? 0}개</h2>
                        <p>작성한 감상 수</p>
                    </div>
                </article>

                <article className="record-card">
                    <div className="record-card-body">
                        <p className="eyebrow">Average rating</p>
                        <h2>{formatAverageRating(summary?.averageRating ?? null)}</h2>
                        <p>감상 평균 평점</p>
                    </div>
                </article>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                    gap: "24px",
                }}
            >
                <article className="detail-card">
                    <h2 style={{ marginTop: 0 }}>월별 관람 통계</h2>

                    {monthlyVisits.length === 0 ? (
                        <p className="info-text">아직 월별 관람 통계가 없습니다.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {monthlyVisits.map((item) => (
                                <div key={item.month}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: "12px",
                                            marginBottom: "6px",
                                            fontSize: "14px",
                                            fontWeight: 800,
                                        }}
                                    >
                                        <span>{item.month}</span>
                                        <span>{item.count}회</span>
                                    </div>

                                    <div
                                        style={{
                                            height: "12px",
                                            borderRadius: "999px",
                                            background: "#eee3d4",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: getBarWidth(item.count, monthlyMaxCount),
                                                height: "100%",
                                                borderRadius: "999px",
                                                background: "#8a6f4d",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <article className="detail-card">
                    <h2 style={{ marginTop: 0 }}>자주 방문한 미술관</h2>

                    {topMuseums.length === 0 ? (
                        <p className="info-text">아직 미술관 방문 통계가 없습니다.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {topMuseums.map((item) => (
                                <div key={item.museumName}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: "12px",
                                            marginBottom: "6px",
                                            fontSize: "14px",
                                            fontWeight: 800,
                                        }}
                                    >
                                        <span>{item.museumName}</span>
                                        <span>{item.count}회</span>
                                    </div>

                                    <div
                                        style={{
                                            height: "12px",
                                            borderRadius: "999px",
                                            background: "#eee3d4",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: getBarWidth(item.count, museumMaxCount),
                                                height: "100%",
                                                borderRadius: "999px",
                                                background: "#8a6f4d",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>

                <article className="detail-card">
                    <h2 style={{ marginTop: 0 }}>평점 분포</h2>

                    {ratingDistribution.length === 0 ? (
                        <p className="info-text">아직 평점 통계가 없습니다.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {[1, 2, 3, 4, 5].map((rating) => {
                                const item = ratingDistribution.find(
                                    (ratingItem) => ratingItem.rating === rating
                                );

                                const count = item?.count ?? 0;

                                return (
                                    <div key={rating}>
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                gap: "12px",
                                                marginBottom: "6px",
                                                fontSize: "14px",
                                                fontWeight: 800,
                                            }}
                                        >
                                            <span>{rating}점</span>
                                            <span>{count}개</span>
                                        </div>

                                        <div
                                            style={{
                                                height: "12px",
                                                borderRadius: "999px",
                                                background: "#eee3d4",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: getBarWidth(count, ratingMaxCount),
                                                    height: "100%",
                                                    borderRadius: "999px",
                                                    background: "#8a6f4d",
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </article>

                <article className="detail-card">
                    <h2 style={{ marginTop: 0 }}>자주 쓴 감정 태그</h2>

                    {topEmotionTags.length === 0 ? (
                        <p className="info-text">아직 감정 태그 통계가 없습니다.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {topEmotionTags.map((item) => (
                                <div key={item.emotionTag}>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: "12px",
                                            marginBottom: "6px",
                                            fontSize: "14px",
                                            fontWeight: 800,
                                        }}
                                    >
                                        <span>{item.emotionTag}</span>
                                        <span>{item.count}회</span>
                                    </div>

                                    <div
                                        style={{
                                            height: "12px",
                                            borderRadius: "999px",
                                            background: "#eee3d4",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: getBarWidth(item.count, emotionTagMaxCount),
                                                height: "100%",
                                                borderRadius: "999px",
                                                background: "#8a6f4d",
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </article>
            </div>
        </section>
    );
}

export default StatisticsPage;