import { Link } from "react-router-dom";

function HomePage() {
    return (
        <main>
            <h1>Artlog</h1>
            <p>전시, 작품, 감상을 기록하는 나만의 아트 아카이브</p>

            <nav>
                <Link to="/login">로그인</Link>
                {" | "}
                <Link to="/signup">회원가입</Link>
            </nav>
        </main>
    );
}

export default HomePage;