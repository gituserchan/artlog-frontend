import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";
import type {
    MonthlyVisitResponse,
    RatingDistributionResponse,
    StatisticsSummaryResponse,
    TopEmotionTagResponse,
    TopMuseumResponse,
} from "../types/statistics";

export const getStatisticsSummary = async () => {
    const response = await axiosInstance.get<
        ApiResponse<StatisticsSummaryResponse>
    >("/api/statistics/summary");

    return response.data;
};

export const getMonthlyVisits = async () => {
    const response = await axiosInstance.get<ApiResponse<MonthlyVisitResponse[]>>(
        "/api/statistics/monthly-visits"
    );

    return response.data;
};

export const getTopMuseums = async () => {
    const response = await axiosInstance.get<ApiResponse<TopMuseumResponse[]>>(
        "/api/statistics/top-museums"
    );

    return response.data;
};

export const getRatingDistribution = async () => {
    const response = await axiosInstance.get<
        ApiResponse<RatingDistributionResponse[]>
    >("/api/statistics/rating-distribution");

    return response.data;
};

export const getTopEmotionTags = async () => {
    const response = await axiosInstance.get<
        ApiResponse<TopEmotionTagResponse[]>
    >("/api/statistics/top-emotion-tags");

    return response.data;
};