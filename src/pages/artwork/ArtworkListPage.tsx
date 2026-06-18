import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getArtworks } from "../../api/artworkApi";
import type { ArtworkSimpleResponse } from "../../types/artwork";

function ArtworkListPage() {
    const navigate = useNavigate();
    const params = useParams();

    const exhibitionId = Number(params.exhibitionId);

    const [artworks, setArtworks] = useState<ArtworkSimpleResponse[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchArtworks = async (targetPage = 0) => {
        if (!exhibitionId || Number.isNaN(exhibitionId)) {
            setMessage("올바르지 않은 전시 기록입니다.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await getArtworks(exhibitionId, targetPage, 10);

            setArtworks(response.data.content);
            setPage(response.data.page);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error(error);
            setMessage("작품 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtworks(0);
    }, [exhibitionId]);

    const handlePreviousPage = async () => {
        if (page <= 0) {
            return;
        }

        await fetchArtworks(page - 1);
    };

    const handleNextPage = async () => {
        if (page + 1 >= totalPages) {
            return;
        }

        await fetchArtworks(page + 1);
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Artwork archive</p>
                    <h1>작품 기록</h1>
                    <p className="page-description">
                        전시에서 인상 깊었던 작품들을 따로 기록할 수 있습니다.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate(`/exhibitions/${exhibitionId}/artworks/new`)}
                >
                    작품 등록
                </button>
            </div>

            {loading && <p className="info-text">작품 기록을 불러오는 중입니다.</p>}

            {message && <p className="error-text">{message}</p>}

            {!loading && !message && (
                <>
                    <p className="result-count">총 {totalElements}개의 작품 기록</p>

                    {artworks.length === 0 ? (
                        <div className="empty-box">
                            <p>아직 등록된 작품 기록이 없습니다.</p>
                        </div>
                    ) : (
                        <div className="card-grid">
                            {artworks.map((artwork) => (
                                <article
                                    key={artwork.artworkId}
                                    className="record-card clickable-card"
                                    onClick={() =>
                                        navigate(
                                            `/exhibitions/${exhibitionId}/artworks/${artwork.artworkId}`
                                        )
                                    }
                                >
                                    <div className="poster-box">
                                        {artwork.imageUrl ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}${
                                                    artwork.imageUrl
                                                }`}
                                                alt={artwork.title}
                                            />
                                        ) : (
                                            <span>No image</span>
                                        )}
                                    </div>

                                    <div className="record-card-body">
                                        <h2>{artwork.title}</h2>
                                        <p>{artwork.artist || "작가 미상"}</p>

                                        <dl>
                                            <div>
                                                <dt>제작 연도</dt>
                                                <dd>{artwork.productionYear || "-"}</dd>
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

                    <div className="bottom-actions">
                        <button
                            type="button"
                            className="subtle-button"
                            onClick={() => navigate(`/exhibitions/${exhibitionId}`)}
                        >
                            전시 상세로
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}

export default ArtworkListPage;