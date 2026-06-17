import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { signup } from "../../api/authApi";

function SignupPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            await signup({
                email,
                password,
                nickname,
            });

            alert("회원가입이 완료되었습니다.");
            navigate("/login");
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "회원가입에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("회원가입에 실패했습니다.");
        }
    };

    return (
        <main>
            <h1>회원가입</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>이메일</label>
                    <input
                        type="email"
                        value={email}
                        required
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label>비밀번호</label>
                    <input
                        type="password"
                        value={password}
                        required
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <div>
                    <label>닉네임</label>
                    <input
                        value={nickname}
                        required
                        onChange={(event) => setNickname(event.target.value)}
                    />
                </div>

                <button type="submit">회원가입</button>
            </form>

            {message && <p>{message}</p>}
        </main>
    );
}

export default SignupPage;