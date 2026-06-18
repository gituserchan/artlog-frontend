import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ExhibitionCreatePage from "../pages/exhibition/ExhibitionCreatePage";
import ExhibitionDetailPage from "../pages/exhibition/ExhibitionDetailPage";
import ExhibitionListPage from "../pages/exhibition/ExhibitionListPage";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "signup",
                element: <SignupPage />,
            },
            {
                path: "exhibitions",
                element: <ExhibitionListPage />,
            },
            {
                path: "exhibitions/new",
                element: <ExhibitionCreatePage />,
            },
            {
                path: "exhibitions/:exhibitionId",
                element: <ExhibitionDetailPage />,
            },
        ],
    },
]);

export default router;