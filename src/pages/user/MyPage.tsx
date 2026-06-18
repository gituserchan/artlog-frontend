import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { getMyInfo, updateMyInfo, updateMyPassword } from "../../api/userApi";
import type { UserInfoResponse } from "../../types/user";

function MyPage() {
    const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);

    const [nickname, setNickname] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const formatDateTime = (dateTime: string) => {
        return dateTime.replace("T", " ").slice(0, 16);
    };

    const getErrorMessage = (error: unknown, fallbackMessage: string) => {
        if (axios.isAxiosError(error)) {
            return error.response?.data?.message || fallbackMessage;
        }

        return fallbackMessage;
    };

    const fetchMyInfo = async () => {
        setLoading(true);
        setErrorMessage("");

        try {
            const response = await getMyInfo();

            setUserInfo(response.data);
            setNickname(response.data.nickname);
        } catch (error) {
            console.error(error);
            setErrorMessage(getErrorMessage(error, "내 정보를 불러오지 못했습니다."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyInfo();
    }, []);

    const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setProfileMessage("");
        setErrorMessage("");

        try {
            const response = await updateMyInfo({
                nickname,
            });

            setUserInfo(response.data);
            setNickname(response.data.nickname);
            setProfileMessage("닉네임이 수정되었습니다.");
        } catch (error) {
            console.error(error);
            setErrorMessage(getErrorMessage(error, "내 정보 수정에 실패했습니다."));
        }
    };

    const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setPasswordMessage("");
        setErrorMessage("");

        if (newPassword !== newPasswordConfirm) {
            setErrorMessage("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        try {
            await updateMyPassword({
                currentPassword,
                newPassword,
            });

            setCurrentPassword("");
            setNewPassword("");
            setNewPasswordConfirm("");
            setPasswordMessage("비밀번호가 수정되었습니다.");
        } catch (error) {
            console.error(error);
            setErrorMessage(getErrorMessage(error, "비밀번호 수정에 실패했습니다."));
        }
    };

    if (loading) {
        return <p className="info-text">내 정보를 불러오는 중입니다.</p>;
    }

    if (errorMessage && !userInfo) {
        return <p className="error-text">{errorMessage}</p>;
    }

    if (!userInfo) {
        return <p className="info-text">내 정보가 없습니다.</p>;
    }

    return (
        <section>
            <div className="page-title-row">
                <div>
                    <p className="eyebrow">My page</p>
                    <h1>마이페이지</h1>
                    <p className="page-description">
                        내 계정 정보를 확인하고 닉네임과 비밀번호를 수정할 수 있습니다.
                    </p>
                </div>
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <div className="detail-card" style={{ marginBottom: "28px" }}>
                <dl className="detail-list">
                    <div>
                        <dt>회원 번호</dt>
                        <dd>{userInfo.userId}</dd>
                    </div>

                    <div>
                        <dt>이메일</dt>
                        <dd>{userInfo.email}</dd>
                    </div>

                    <div>
                        <dt>닉네임</dt>
                        <dd>{userInfo.nickname}</dd>
                    </div>

                    <div>
                        <dt>권한</dt>
                        <dd>{userInfo.role}</dd>
                    </div>

                    <div>
                        <dt>가입일</dt>
                        <dd>{formatDateTime(userInfo.createdAt)}</dd>
                    </div>
                </dl>
            </div>

            <div className="detail-layout">
                <div className="detail-card">
                    <h2 style={{ marginTop: 0 }}>내 정보 수정</h2>

                    <form className="record-form" onSubmit={handleProfileSubmit}>
                        <div>
                            <label>닉네임</label>
                            <input
                                value={nickname}
                                required
                                maxLength={30}
                                placeholder="닉네임을 입력하세요"
                                onChange={(event) => setNickname(event.target.value)}
                            />
                        </div>

                        {profileMessage && <p className="info-text">{profileMessage}</p>}

                        <div className="form-actions">
                            <button type="submit">닉네임 수정</button>
                        </div>
                    </form>
                </div>

                <div className="detail-card">
                    <h2 style={{ marginTop: 0 }}>비밀번호 수정</h2>

                    <form className="record-form" onSubmit={handlePasswordSubmit}>
                        <div>
                            <label>현재 비밀번호</label>
                            <input
                                type="password"
                                value={currentPassword}
                                required
                                placeholder="현재 비밀번호를 입력하세요"
                                onChange={(event) => setCurrentPassword(event.target.value)}
                            />
                        </div>

                        <div>
                            <label>새 비밀번호</label>
                            <input
                                type="password"
                                value={newPassword}
                                required
                                minLength={8}
                                maxLength={30}
                                placeholder="새 비밀번호를 입력하세요"
                                onChange={(event) => setNewPassword(event.target.value)}
                            />
                        </div>

                        <div>
                            <label>새 비밀번호 확인</label>
                            <input
                                type="password"
                                value={newPasswordConfirm}
                                required
                                minLength={8}
                                maxLength={30}
                                placeholder="새 비밀번호를 한 번 더 입력하세요"
                                onChange={(event) => setNewPasswordConfirm(event.target.value)}
                            />
                        </div>

                        {passwordMessage && <p className="info-text">{passwordMessage}</p>}

                        <div className="form-actions">
                            <button type="submit">비밀번호 수정</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default MyPage;