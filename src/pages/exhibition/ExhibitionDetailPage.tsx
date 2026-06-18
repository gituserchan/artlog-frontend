import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { deleteExhibition, getExhibition } from "../../api/exhibitionApi";
import type { ExhibitionResponse } from "../../types/exhibition";

function ExhibitionDetailPage() {
    const navigate = useNavigate();
    const params = useParams();

    const exhibitionId = Number(params.exhibitionId);

    const [exhibition, setExhibition] = useState<ExhibitionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const fetchExhibition = async () => {
        if (!exhibitionId || Number.isNaN(exhibitionId)) {
            setMessage("올바르지 않은 전시 기록입니다.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await getExhibition(exhibitionId);
            setExhibition(response.data);
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

    const handleDelete = async () => {
        if (!exhibition) {
            return;
        }

        const confirmed = window.confirm("이 전시 기록을 삭제하시겠습니까?");

        if (!confirmed) {
            return;
        }

        try {
            await deleteExhibition(exhibition.exhibitionId);

            alert("전시 기록이 삭제되었습니다.");
            navigate("/exhibitions");
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "전시 기록 삭제에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("전시 기록 삭제에 실패했습니다.");
        }
    };

    if (loading) {
        return <p className="info-text">전시 기록을 불러오는 중입니다.</p>;
    }

    if (message) {
        return <p className="error-text">{message}</p>;
    }

    if (!exhibition) {
        return <p className="info-text">전시 기록이 없습니다.</p>;
    }

    return (
        <section>
            <div className="detail-header">
                <div>
                    <p className="eyebrow">Exhibition detail</p>
                    <h1>{exhibition.title}</h1>
                    <p className="page-description">{exhibition.museumName}</p>
                </div>

                <div className="detail-actions">
                    <Link
                        to={`/exhibitions/${exhibition.exhibitionId}/edit`}
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

                <div className="detail-card">
                    <dl className="detail-list">
                        <div>
                            <dt>미술관 / 전시장</dt>
                            <dd>{exhibition.museumName}</dd>
                        </div>

                        <div>
                            <dt>지역</dt>
                            <dd>{exhibition.location || "-"}</dd>
                        </div>

                        <div>
                            <dt>전시 기간</dt>
                            <dd>
                                {exhibition.startDate || "-"} ~ {exhibition.endDate || "-"}
                            </dd>
                        </div>

                        <div>
                            <dt>관람일</dt>
                            <dd>{exhibition.visitDate || "-"}</dd>
                        </div>

                        <div>
                            <dt>등록일</dt>
                            <dd>{exhibition.createdAt}</dd>
                        </div>

                        <div>
                            <dt>수정일</dt>
                            <dd>{exhibition.updatedAt}</dd>
                        </div>
                    </dl>

                    <div className="memo-box">
                        <h2>메모</h2>
                        <p>{exhibition.memo || "작성된 메모가 없습니다."}</p>
                    </div>
                </div>
            </div>

            <div className="bottom-actions">
                <Link to="/exhibitions" className="secondary-link">
                    목록으로
                </Link>
                <Link
                    to={`/exhibitions/${exhibition.exhibitionId}/artworks`}
                    className="primary-link"
                >
                    작품 기록 보기
                </Link>
            </div>
        </section>
    );
}

export default ExhibitionDetailPage;