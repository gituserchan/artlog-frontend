import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { deleteArtwork, getArtwork } from "../../api/artworkApi";
import type { ArtworkResponse } from "../../types/artwork";

function ArtworkDetailPage() {
    const navigate = useNavigate();
    const params = useParams();

    const exhibitionId = Number(params.exhibitionId);
    const artworkId = Number(params.artworkId);

    const [artwork, setArtwork] = useState<ArtworkResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchArtwork = async () => {
        if (
            !exhibitionId ||
            Number.isNaN(exhibitionId) ||
            !artworkId ||
            Number.isNaN(artworkId)
        ) {
            setMessage("올바르지 않은 작품 기록입니다.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await getArtwork(exhibitionId, artworkId);
            setArtwork(response.data);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "작품 기록을 불러오지 못했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("작품 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArtwork();
    }, [exhibitionId, artworkId]);

    const handleDelete = async () => {
        if (!artwork) {
            return;
        }

        const confirmed = window.confirm("이 작품 기록을 삭제하시겠습니까?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteArtwork(exhibitionId, artwork.artworkId);

            alert("작품 기록이 삭제되었습니다.");
            navigate(`/exhibitions/${exhibitionId}/artworks`);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "작품 기록 삭제에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("작품 기록 삭제에 실패했습니다.");
        }
    };

    if (loading) {
        return <p className="info-text">작품 기록을 불러오는 중입니다.</p>;
    }

    if (message) {
        return <p className="error-text">{message}</p>;
    }

    if (!artwork) {
        return <p className="info-text">작품 기록이 없습니다.</p>;
    }

    return (
        <section>
            <div className="detail-header">
                <div>
                    <p className="eyebrow">Artwork detail</p>
                    <h1>{artwork.title}</h1>
                    <p className="page-description">
                        {artwork.artistName || "작가 미상"}
                    </p>
                </div>

                <div className="detail-actions">
                    <Link
                        to={`/exhibitions/${exhibitionId}/artworks/${artwork.artworkId}/edit`}
                        className="secondary-link"
                    >
                        수정
                    </Link>
                    <button type="button" className="danger-button" onClick={handleDelete}>
                        삭제
                    </button>
                </div>
            </div>

            <div className="detail-layout">
                <div className="detail-poster">
                    {artwork.imageUrl ? (
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${artwork.imageUrl}`}
                            alt={artwork.title}
                        />
                    ) : (
                        <span>No image</span>
                    )}
                </div>

                <div className="detail-card">
                    <dl className="detail-list">
                        <div>
                            <dt>작품명</dt>
                            <dd>{artwork.title}</dd>
                        </div>

                        <div>
                            <dt>작가</dt>
                            <dd>{artwork.artistName || "작가 미상"}</dd>
                        </div>

                        <div>
                            <dt>제작 연도</dt>
                            <dd>{artwork.productionYear || "-"}</dd>
                        </div>

                        <div>
                            <dt>재료 / 매체</dt>
                            <dd>{artwork.medium || "-"}</dd>
                        </div>

                        <div>
                            <dt>등록일</dt>
                            <dd>{artwork.createdAt}</dd>
                        </div>

                        <div>
                            <dt>수정일</dt>
                            <dd>{artwork.updatedAt}</dd>
                        </div>
                    </dl>

                    <div className="memo-box">
                        <h2>작품 메모</h2>
                        <p>{artwork.memo || "작성된 메모가 없습니다."}</p>
                    </div>
                </div>
            </div>

            <div className="bottom-actions">
                <Link
                    to={`/exhibitions/${exhibitionId}/artworks`}
                    className="secondary-link"
                >
                    작품 목록으로
                </Link>
                <Link to={`/exhibitions/${exhibitionId}`} className="primary-link">
                    전시 상세로
                </Link>
            </div>
        </section>
    );
}

export default ArtworkDetailPage;