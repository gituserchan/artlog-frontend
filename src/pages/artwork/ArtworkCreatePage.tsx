import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { createArtwork } from "../../api/artworkApi";
import { uploadImage } from "../../api/fileApi";

function ArtworkCreatePage() {
    const navigate = useNavigate();
    const params = useParams();

    const exhibitionId = Number(params.exhibitionId);

    const [title, setTitle] = useState("");
    const [artistName, setArtistName] = useState("");
    const [productionYear, setProductionYear] = useState("");
    const [medium, setMedium] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [memo, setMemo] = useState("");
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!exhibitionId || Number.isNaN(exhibitionId)) {
            setMessage("올바르지 않은 전시 기록입니다.");
            return;
        }

        setMessage("");
        setUploading(true);

        try {
            let imageUrl: string | null = null;

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            const response = await createArtwork(exhibitionId, {
                title,
                artistName,
                productionYear,
                medium,
                imageUrl,
                memo,
            });

            alert("작품 기록이 등록되었습니다.");
            navigate(
                `/exhibitions/${exhibitionId}/artworks/${response.data.artworkId}`
            );
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "작품 기록 등록에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("작품 기록 등록에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">New artwork</p>
                    <h1>작품 기록 등록</h1>
                    <p className="page-description">
                        전시에서 기억하고 싶은 작품 정보를 기록합니다.
                    </p>
                </div>
            </div>

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
                    <label>작품 이미지</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                    />
                    {imageFile && (
                        <p className="info-text">선택한 파일: {imageFile.name}</p>
                    )}
                </div>

                <div>
                    <label>작품 메모</label>
                    <textarea
                        value={memo}
                        placeholder="작품에서 인상 깊었던 점을 남겨보세요"
                        onChange={(event) => setMemo(event.target.value)}
                    />
                </div>

                {message && <p className="error-text">{message}</p>}

                <div className="form-actions">
                    <button type="submit" disabled={uploading}>
                        {uploading ? "등록 중..." : "등록하기"}
                    </button>
                    <button
                        type="button"
                        className="subtle-button"
                        onClick={() => navigate(`/exhibitions/${exhibitionId}/artworks`)}
                    >
                        취소
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ArtworkCreatePage;