import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getArtwork, updateArtwork } from "../../api/artworkApi";

function ArtworkEditPage() {
    const navigate = useNavigate();
    const params = useParams();

    const exhibitionId = Number(params.exhibitionId);
    const artworkId = Number(params.artworkId);

    const [title, setTitle] = useState("");
    const [artistName, setArtistName] = useState("");
    const [productionYear, setProductionYear] = useState("");
    const [medium, setMedium] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [memo, setMemo] = useState("");

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
            const artwork = response.data;

            setTitle(artwork.title);
            setArtistName(artwork.artistName || "");
            setProductionYear(artwork.productionYear || "");
            setMedium(artwork.medium || "");
            setImageUrl(artwork.imageUrl || "");
            setMemo(artwork.memo || "");
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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (
            !exhibitionId ||
            Number.isNaN(exhibitionId) ||
            !artworkId ||
            Number.isNaN(artworkId)
        ) {
            setMessage("올바르지 않은 작품 기록입니다.");
            return;
        }

        setMessage("");

        try {
            const response = await updateArtwork(exhibitionId, artworkId, {
                title,
                artistName,
                productionYear,
                medium,
                imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
                memo,
            });

            alert("작품 기록이 수정되었습니다.");
            navigate(
                `/exhibitions/${exhibitionId}/artworks/${response.data.artworkId}`
            );
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "작품 기록 수정에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("작품 기록 수정에 실패했습니다.");
        }
    };

    if (loading) {
        return <p className="info-text">작품 기록을 불러오는 중입니다.</p>;
    }

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Edit artwork</p>
                    <h1>작품 기록 수정</h1>
                    <p className="page-description">
                        등록한 작품 정보를 수정할 수 있습니다.
                    </p>
                </div>
            </div>

            {message && <p className="error-text">{message}</p>}

            <form className="record-form" onSubmit={handleSubmit}>
                <div>
                    <label>작품명</label>
                    <input
                        value={title}
                        required
                        placeholder="작품명을 입력하세요"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>

                <div>
                    <label>작가</label>
                    <input
                        value={artistName}
                        placeholder="작가명을 입력하세요"
                        onChange={(event) => setArtistName(event.target.value)}
                    />
                </div>

                <div>
                    <label>제작 연도</label>
                    <input
                        value={productionYear}
                        placeholder="예: 2024"
                        onChange={(event) => setProductionYear(event.target.value)}
                    />
                </div>

                <div>
                    <label>재료 / 매체</label>
                    <input
                        value={medium}
                        placeholder="예: 캔버스에 유채, 영상, 설치"
                        onChange={(event) => setMedium(event.target.value)}
                    />
                </div>

                <div>
                    <label>작품 이미지 URL</label>
                    <input
                        value={imageUrl}
                        placeholder="/uploads/images/example.png"
                        onChange={(event) => setImageUrl(event.target.value)}
                    />
                </div>

                <div>
                    <label>작품 메모</label>
                    <textarea
                        value={memo}
                        placeholder="작품에서 인상 깊었던 점을 남겨보세요"
                        onChange={(event) => setMemo(event.target.value)}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit">수정하기</button>
                    <button
                        type="button"
                        className="subtle-button"
                        onClick={() =>
                            navigate(`/exhibitions/${exhibitionId}/artworks/${artworkId}`)
                        }
                    >
                        취소
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ArtworkEditPage;