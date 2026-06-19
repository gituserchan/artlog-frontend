import axiosInstance from "./axiosInstance";
import type { ApiResponse, PageResponse } from "../types/api";
import type {
    ReviewCreateRequest,
    ReviewResponse,
    ReviewSearchParams,
    ReviewSimpleResponse,
    ReviewUpdateRequest,
} from "../types/review";

export const getReviews = async (page = 0, size = 10) => {
    const response = await axiosInstance.get<
        ApiResponse<PageResponse<ReviewSimpleResponse>>
    >("/api/reviews", {
        params: {
            page,
            size,
        },
    });

    return response.data;
};

export const searchReviews = async (
    searchParams: ReviewSearchParams,
    page = 0,
    size = 10
) => {
    const response = await axiosInstance.get<
        ApiResponse<PageResponse<ReviewSimpleResponse>>
    >("/api/reviews/search", {
        params: {
            ...searchParams,
            page,
            size,
        },
    });

    return response.data;
};

export const getReview = async (reviewId: number) => {
    const response = await axiosInstance.get<ApiResponse<ReviewResponse>>(
        `/api/reviews/${reviewId}`
    );

    return response.data;
};

export const createExhibitionReview = async (
    exhibitionId: number,
    request: ReviewCreateRequest
) => {
    const response = await axiosInstance.post<ApiResponse<ReviewResponse>>(
        `/api/exhibitions/${exhibitionId}/reviews`,
        request
    );

    return response.data;
};

export const createArtworkReview = async (
    exhibitionId: number,
    artworkId: number,
    request: ReviewCreateRequest
) => {
    const response = await axiosInstance.post<ApiResponse<ReviewResponse>>(
        `/api/exhibitions/${exhibitionId}/artworks/${artworkId}/reviews`,
        request
    );

    return response.data;
};

export const updateReview = async (
    reviewId: number,
    request: ReviewUpdateRequest
) => {
    const response = await axiosInstance.put<ApiResponse<ReviewResponse>>(
        `/api/reviews/${reviewId}`,
        request
    );

    return response.data;
};

export const deleteReview = async (reviewId: number) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/reviews/${reviewId}`
    );

    return response.data;
};