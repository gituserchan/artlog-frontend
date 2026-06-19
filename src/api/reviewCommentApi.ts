import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";
import type {
    ReviewCommentCreateRequest,
    ReviewCommentResponse,
} from "../types/reviewComment";

export const getReviewComments = async (reviewId: number) => {
    const response = await axiosInstance.get<
        ApiResponse<ReviewCommentResponse[]>
    >(`/api/public/reviews/${reviewId}/comments`);

    return response.data;
};

export const createReviewComment = async (
    reviewId: number,
    request: ReviewCommentCreateRequest
) => {
    const response = await axiosInstance.post<ApiResponse<ReviewCommentResponse>>(
        `/api/public/reviews/${reviewId}/comments`,
        request
    );

    return response.data;
};

export const deleteReviewComment = async (
    reviewId: number,
    commentId: number
) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/public/reviews/${reviewId}/comments/${commentId}`
    );

    return response.data;
};