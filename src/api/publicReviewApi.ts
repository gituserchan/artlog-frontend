import axiosInstance from "./axiosInstance";
import type { ApiResponse, PageResponse } from "../types/api";
import type {
    PublicReviewResponse,
    PublicReviewSimpleResponse,
} from "../types/publicReview";

export const getPublicReviews = async (page = 0, size = 10) => {
    const response = await axiosInstance.get<
        ApiResponse<PageResponse<PublicReviewSimpleResponse>>
    >("/api/public/reviews", {
        params: {
            page,
            size,
        },
    });

    return response.data;
};

export const getPublicReview = async (reviewId: number) => {
    const response = await axiosInstance.get<ApiResponse<PublicReviewResponse>>(
        `/api/public/reviews/${reviewId}`
    );

    return response.data;
};

export const likeReview = async (reviewId: number) => {
    const response = await axiosInstance.post<ApiResponse<null>>(
        `/api/reviews/${reviewId}/likes`
    );

    return response.data;
};

export const unlikeReview = async (reviewId: number) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/reviews/${reviewId}/likes`
    );

    return response.data;
};

export const bookmarkReview = async (reviewId: number) => {
    const response = await axiosInstance.post<ApiResponse<null>>(
        `/api/reviews/${reviewId}/bookmarks`
    );

    return response.data;
};

export const unbookmarkReview = async (reviewId: number) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/reviews/${reviewId}/bookmarks`
    );

    return response.data;
};