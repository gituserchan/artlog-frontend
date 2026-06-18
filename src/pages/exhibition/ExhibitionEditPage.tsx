import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getExhibition, updateExhibition } from "../../api/exhibitionApi";
import { uploadImage } from "../../api/fileApi";

function ExhibitionEditPage() {
    const navigate = useNavigate();
    const params = useParams();

    const exhibitionId = Number(params.exhibitionId);

    const [title, setTitle] = useState("");
    const [museumName, setMuseumName] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [posterImageUrl, setPosterImageUrl] = useState("");
    const [posterImageFile, setPosterImageFile] = useState<File | null>(null);
    const [memo, setMemo] = useState("");

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const getImageSrc = (imageUrl: string) => {
        if (imageUrl.startsWith("http")) {
            return imageUrl;
        }

        return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
    };

    const fetchExhibition = async () => {
        if (!exhibitionId || Number.isNaN(exhibitionId)) {
            setMessage("올바르지 않은 전시 기록입니다.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await getExhibition(exhibitionId);
            const exhibition = response.data;

            setTitle(exhibition.title);
            setMuseumName(exhibition.museumName);
            setLocation(exhibition.location || "");
            setStartDate(exhibition.startDate || "");
            setEndDate(exhibition.endDate || "");
            setVisitDate(exhibition.visitDate || "");
            setPosterImageUrl(exhibition.posterImageUrl || "");
            setMemo(exhibition.memo || "");
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "전시 기록을 불러오지 못했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("전시 기록을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExhibition();
    }, [exhibitionId]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!exhibitionId || Number.isNaN(exhibitionId)) {
            setMessage("올바르지 않은 전시 기록입니다.");
            return;
        }

        setMessage("");
        setUploading(true);

        try {
            let nextPosterImageUrl: string | null = posterImageUrl || null;

            if (posterImageFile) {
                nextPosterImageUrl = await uploadImage(posterImageFile);
            }

            await updateExhibition(exhibitionId, {
                title,
                museumName,
                location,
                startDate,
                endDate,
                visitDate,
                posterImageUrl: nextPosterImageUrl,
                memo,
            });

            alert("전시 기록이 수정되었습니다.");
            navigate(`/exhibitions/${exhibitionId}`);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "전시 기록 수정에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("전시 기록 수정에 실패했습니다.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <p className="info-text">전시 기록을 불러오는 중입니다.</p>;
    }

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">Edit exhibition</p>
                    <h1>전시 기록 수정</h1>
                    <p className="page-description">
                        등록한 전시 정보를 수정할 수 있습니다.
                    </p>
                </div>
            </div>

            {message && <p className="error-text">{message}</p>}

            <form className="record-form" onSubmit={handleSubmit}>
                <div>
                    <label>전시명</label>
                    <input
                        value={title}
                        required
                        placeholder="전시명을 입력하세요"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>

                <div>
                    <label>미술관 / 전시장</label>
                    <input
                        value={museumName}
                        required
                        placeholder="미술관 또는 전시장 이름"
                        onChange={(event) => setMuseumName(event.target.value)}
                    />
                </div>

                <div>
                    <label>지역</label>
                    <input
                        value={location}
                        required
                        placeholder="예: 수원, 서울, 부산"
                        onChange={(event) => setLocation(event.target.value)}
                    />
                </div>

                <div className="form-grid">
                    <div>
                        <label>전시 시작일</label>
                        <input
                            type="date"
                            value={startDate}
                            required
                            onChange={(event) => setStartDate(event.target.value)}
                        />
                    </div>

                    <div>
                        <label>전시 종료일</label>
                        <input
                            type="date"
                            value={endDate}
                            required
                            onChange={(event) => setEndDate(event.target.value)}
                        />
                    </div>

                    <div>
                        <label>관람일</label>
                        <input
                            type="date"
                            value={visitDate}
                            required
                            onChange={(event) => setVisitDate(event.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label>현재 포스터 이미지</label>
                    <div className="poster-box">
                        {posterImageUrl ? (
                            <img src={getImageSrc(posterImageUrl)} alt={title} />
                        ) : (
                            <span>No image</span>
                        )}
                    </div>
                </div>

                <div>
                    <label>새 포스터 이미지 선택</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                            setPosterImageFile(event.target.files?.[0] ?? null)
                        }
                    />
                    {posterImageFile && (
                        <p className="info-text">선택한 파일: {posterImageFile.name}</p>
                    )}
                </div>

                <div>
                    <label>메모</label>
                    <textarea
                        value={memo}
                        placeholder="전시에 대한 간단한 메모를 남겨보세요"
                        onChange={(event) => setMemo(event.target.value)}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={uploading}>
                        {uploading ? "수정 중..." : "수정하기"}
                    </button>
                    <button
                        type="button"
                        className="subtle-button"
                        onClick={() => navigate(`/exhibitions/${exhibitionId}`)}
                    >
                        취소
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ExhibitionEditPage;