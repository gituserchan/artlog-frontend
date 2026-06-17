import { useEffect, useState } from "react";
import { getExhibitions, searchExhibitions } from "../../api/exhibitionApi";
import type { ExhibitionSimpleResponse } from "../../types/exhibition";

function ExhibitionListPage() {
    const [exhibitions, setExhibitions] = useState<ExhibitionSimpleResponse[]>([]);
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchExhibitions = async (
        targetPage = 0,
        searchKeyword = keyword
    ) => {
        setLoading(true);
        setMessage("");

        try {
            const trimmedKeyword = searchKeyword.trim();

            const response = trimmedKeyword
                ? await searchExhibitions(trimmedKeyword, targetPage, 10)
                : await getExhibitions(targetPage, 10);

            setExhibitions(response.data.content);
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error(error);
            setMessage("전시 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExhibitions(0);
    }, []);

    const handleSearch = async () => {
        await fetchExhibitions(0, keyword);
    };

    const handleReset = async () => {
        setKeyword("");
        await fetchExhibitions(0, "");
    };

    const handlePreviousPage = async () => {
        if (page <= 0) {
            return;
        }

        await fetchExhibitions(page - 1);
    };

    const handleNextPage = async () => {
        if (page + 1 >= totalPages) {
            return;
        }

        await fetchExhibitions(page + 1);
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">My archive</p>
                    <h1>내 전시 기록</h1>
                    <p className="page-description">
                        내가 관람한 전시를 모아보고, 전시명이나 미술관명으로 검색할 수
                        있습니다.
                    </p>
                </div>

                <button type="button">전시 등록</button>
            </div>

            <div className="search-box">
                <input
                    placeholder="전시명, 미술관, 지역, 메모 검색"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />

                <button type="button" onClick={handleSearch}>
                    검색
                </button>

                <button type="button" className="subtle-button" onClick={handleReset}>
                    초기화
                </button>
            </div>

            {loading && <p className="info-text">전시 기록을 불러오는 중입니다.</p>}

            {message && <p className="error-text">{message}</p>}

            {!loading && !message && (
                <>
                    <p className="result-count">총 {totalElements}개의 전시 기록</p>

                    {exhibitions.length === 0 ? (
                        <div className="empty-box">
                            <p>아직 등록된 전시 기록이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {exhibitions.map((exhibition) => (
                                <article key={exhibition.exhibitionId} className="record-card">
                                    <div className="poster-box">
                                        {exhibition.posterImageUrl ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}${
                                                    exhibition.posterImageUrl
                                                }`}
                                                alt={exhibition.title}
                                            />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </div>

                                    <div className="record-card-body">
                                        <h2>{exhibition.title}</h2>
                                        <p>{exhibition.museumName}</p>

                                        <dl>
                                            <div>
                                                <dt>지역</dt>
                                                <dd>{exhibition.location || "-"}</dd>
                                            </div>

                                            <div>
                                                <dt>관람일</dt>
                                                <dd>{exhibition.visitDate || "-"}</dd>
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

export default ExhibitionListPage;