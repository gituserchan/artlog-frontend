import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ArtworkCreatePage from "../pages/artwork/ArtworkCreatePage";
import ArtworkDetailPage from "../pages/artwork/ArtworkDetailPage";
import ArtworkEditPage from "../pages/artwork/ArtworkEditPage";
import ArtworkListPage from "../pages/artwork/ArtworkListPage";
import ExhibitionCreatePage from "../pages/exhibition/ExhibitionCreatePage";
import ExhibitionDetailPage from "../pages/exhibition/ExhibitionDetailPage";
import ExhibitionEditPage from "../pages/exhibition/ExhibitionEditPage";
import ExhibitionListPage from "../pages/exhibition/ExhibitionListPage";
import ReviewCreatePage from "../pages/review/ReviewCreatePage";
import ReviewDetailPage from "../pages/review/ReviewDetailPage";
import ReviewListPage from "../pages/review/ReviewListPage";

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
            {
                path: "exhibitions/:exhibitionId/edit",
                element: <ExhibitionEditPage />,
            },
            {
                path: "exhibitions/:exhibitionId/reviews/new",
                element: <ReviewCreatePage />,
            },
            {
                path: "exhibitions/:exhibitionId/artworks",
                element: <ArtworkListPage />,
            },
            {
                path: "exhibitions/:exhibitionId/artworks/new",
                element: <ArtworkCreatePage />,
            },
            {
                path: "exhibitions/:exhibitionId/artworks/:artworkId",
                element: <ArtworkDetailPage />,
            },
            {
                path: "exhibitions/:exhibitionId/artworks/:artworkId/edit",
                element: <ArtworkEditPage />,
            },
            {
                path: "exhibitions/:exhibitionId/artworks/:artworkId/reviews/new",
                element: <ReviewCreatePage />,
            },
            {
                path: "reviews",
                element: <ReviewListPage />,
            },
            {
                path: "reviews/:reviewId",
                element: <ReviewDetailPage />,
            },
        ],
    },
]);

export default router;