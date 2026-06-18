import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createExhibition } from "../../api/exhibitionApi";

function ExhibitionCreatePage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [museumName, setMuseumName] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [visitDate, setVisitDate] = useState("");
    const [posterImageUrl, setPosterImageUrl] = useState("");
    const [memo, setMemo] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await createExhibition({
                title,
                museumName,
                location,
                startDate,
                endDate,
                visitDate,
                posterImageUrl: posterImageUrl.trim() ? posterImageUrl.trim() : null,
                memo,
            });

            alert("전시 기록이 등록되었습니다.");
            navigate(`/exhibitions/${response.data.exhibitionId}`);
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "전시 기록 등록에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("전시 기록 등록에 실패했습니다.");
        }
    };

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">New exhibition</p>
                    <h1>전시 기록 등록</h1>
                    <p className="page-description">
                        관람한 전시의 기본 정보와 메모를 기록합니다.
                    </p>
                </div>
            </div>

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
                    <label>포스터 이미지 URL</label>
                    <input
                        value={posterImageUrl}
                        placeholder="/uploads/images/example.png"
                        onChange={(event) => setPosterImageUrl(event.target.value)}
                    />
                </div>

                <div>
                    <label>메모</label>
                    <textarea
                        value={memo}
                        placeholder="전시에 대한 간단한 메모를 남겨보세요"
                        onChange={(event) => setMemo(event.target.value)}
                    />
                </div>

                {message && <p className="error-text">{message}</p>}

                <div className="form-actions">
                    <button type="submit">등록하기</button>
                    <button
                        type="button"
                        className="subtle-button"
                        onClick={() => navigate("/exhibitions")}
                    >
                        취소
                    </button>
                </div>
            </form>
        </section>
    );
}

export default ExhibitionCreatePage;