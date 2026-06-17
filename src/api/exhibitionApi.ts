import axiosInstance from "./axiosInstance";
import type { ApiResponse, PageResponse } from "../types/api";
import type {
    ExhibitionCreateRequest,
    ExhibitionResponse,
    ExhibitionSimpleResponse,
    ExhibitionUpdateRequest,
} from "../types/exhibition";

export const getExhibitions = async (page = 0, size = 10) => {
    const response = await axiosInstance.get<
        ApiResponse<PageResponse<ExhibitionSimpleResponse>>
    >("/api/exhibitions", {
        params: {
            page,
            size,
        },
    });

    return response.data;
};

export const getExhibition = async (exhibitionId: number) => {
    const response = await axiosInstance.get<ApiResponse<ExhibitionResponse>>(
        `/api/exhibitions/${exhibitionId}`
    );

    return response.data;
};

export const createExhibition = async (request: ExhibitionCreateRequest) => {
    const response = await axiosInstance.post<ApiResponse<ExhibitionResponse>>(
        "/api/exhibitions",
        request
    );

    return response.data;
};

export const updateExhibition = async (
    exhibitionId: number,
    request: ExhibitionUpdateRequest
) => {
    const response = await axiosInstance.put<ApiResponse<ExhibitionResponse>>(
        `/api/exhibitions/${exhibitionId}`,
        request
    );

    return response.data;
};

export const deleteExhibition = async (exhibitionId: number) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
        `/api/exhibitions/${exhibitionId}`
    );

    return response.data;
};

export const searchExhibitions = async (
    keyword: string,
    page = 0,
    size = 10
) => {
    const response = await axiosInstance.get<
        ApiResponse<PageResponse<ExhibitionSimpleResponse>>
    >("/api/exhibitions/search", {
        params: {
            keyword,
            page,
            size,
        },
    });

    return response.data;
};