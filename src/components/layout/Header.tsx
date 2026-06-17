import { Link, useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");

    const isLoggedIn = !!accessToken;

    const handleLogout = () => {
        localStorage.removeItem("accessToken");

        alert("로그아웃되었습니다.");
        navigate("/");
    };

    return (
        <header className="header">
            <Link to="/" className="header-logo">
                Artlog
            </Link>

            <nav className="header-nav">
                <Link to="/public-reviews">공개 감상</Link>

                {isLoggedIn ? (
                    <>
                        <Link to="/exhibitions">내 전시 기록</Link>
                        <Link to="/reviews">내 감상 기록</Link>
                        <Link to="/statistics">통계</Link>
                        <button type="button" className="text-button" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/signup">회원가입</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;