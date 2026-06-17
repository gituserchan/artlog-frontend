import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
    return (
        <>
            <Header />

            <main className="page-container">
                <Outlet />
            </main>
        </>
    );
}

export default Layout;