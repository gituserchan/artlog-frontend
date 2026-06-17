import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { login } from "../../api/authApi";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await login({
                email,
                password,
            });

            localStorage.setItem("accessToken", response.data.accessToken);

            alert("로그인되었습니다.");
            navigate("/");
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || "로그인에 실패했습니다.";

                setMessage(errorMessage);
                return;
            }

            setMessage("로그인에 실패했습니다.");
        }
    };

    return (
        <main>
            <h1>로그인</h1>

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

                <button type="submit">로그인</button>
            </form>

            {message && <p>{message}</p>}
        </main>
    );
}

export default LoginPage;