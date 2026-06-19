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
import PublicReviewDetailPage from "../pages/publicReview/PublicReviewDetailPage";
import PublicReviewListPage from "../pages/publicReview/PublicReviewListPage";
import ReviewCalendarPage from "../pages/review/ReviewCalendarPage";
import ReviewCreatePage from "../pages/review/ReviewCreatePage";
import ReviewDetailPage from "../pages/review/ReviewDetailPage";
import ReviewEditPage from "../pages/review/ReviewEditPage";
import ReviewListPage from "../pages/review/ReviewListPage";
import StatisticsPage from "../pages/statistics/StatisticsPage";
import BookmarkListPage from "../pages/user/BookmarkListPage";
import MyPage from "../pages/user/MyPage";
import ProtectedRoute from "./ProtectedRoute";

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
                path: "public-reviews",
                element: <PublicReviewListPage />,
            },
            {
                path: "public-reviews/:reviewId",
                element: <PublicReviewDetailPage />,
            },
            {
                path: "exhibitions",
                element: (
                    <ProtectedRoute>
                        <ExhibitionListPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/new",
                element: (
                    <ProtectedRoute>
                        <ExhibitionCreatePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/:exhibitionId",
                element: (
                    <ProtectedRoute>
                        <ExhibitionDetailPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/:exhibitionId/edit",
                element: (
                    <ProtectedRoute>
                        <ExhibitionEditPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/:exhibitionId/reviews/new",
                element: (
                    <ProtectedRoute>
                        <ReviewCreatePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/:exhibitionId/artworks",
                element: (
                    <ProtectedRoute>
                        <ArtworkListPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/:exhibitionId/artworks/new",
                element: (
                    <ProtectedRoute>
                        <ArtworkCreatePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/:exhibitionId/artworks/:artworkId",
                element: (
                    <ProtectedRoute>
                        <ArtworkDetailPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/:exhibitionId/artworks/:artworkId/edit",
                element: (
                    <ProtectedRoute>
                        <ArtworkEditPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "exhibitions/:exhibitionId/artworks/:artworkId/reviews/new",
                element: (
                    <ProtectedRoute>
                        <ReviewCreatePage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reviews",
                element: (
                    <ProtectedRoute>
                        <ReviewListPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "calendar",
                element: (
                    <ProtectedRoute>
                        <ReviewCalendarPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reviews/:reviewId",
                element: (
                    <ProtectedRoute>
                        <ReviewDetailPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reviews/:reviewId/edit",
                element: (
                    <ProtectedRoute>
                        <ReviewEditPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "mypage",
                element: (
                    <ProtectedRoute>
                        <MyPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "mypage/bookmarks",
                element: (
                    <ProtectedRoute>
                        <BookmarkListPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "statistics",
                element: (
                    <ProtectedRoute>
                        <StatisticsPage />
                    </ProtectedRoute>
                ),
            },
        ],
    },
]);

export default router;