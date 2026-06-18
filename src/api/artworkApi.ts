import axiosInstance from "./axiosInstance";

import type { ApiResponse, PageResponse } from "../types/api";

import type {

    ArtworkCreateRequest,

    ArtworkResponse,

    ArtworkSimpleResponse,

    ArtworkUpdateRequest,

} from "../types/artwork";

export const getArtworks = async (

    exhibitionId: number,

    page = 0,

    size = 10

) => {

    const response = await axiosInstance.get<

        ApiResponse<PageResponse<ArtworkSimpleResponse>>

    >(`/api/exhibitions/${exhibitionId}/artworks`, {

        params: {

            page,

            size,

        },

    });

    return response.data;

};

export const getArtwork = async (exhibitionId: number, artworkId: number) => {

    const response = await axiosInstance.get<ApiResponse<ArtworkResponse>>(

        `/api/exhibitions/${exhibitionId}/artworks/${artworkId}`

    );

    return response.data;

};

export const createArtwork = async (

    exhibitionId: number,

    request: ArtworkCreateRequest

) => {

    const response = await axiosInstance.post<ApiResponse<ArtworkResponse>>(

        `/api/exhibitions/${exhibitionId}/artworks`,

        request

    );

    return response.data;

};

export const updateArtwork = async (

    exhibitionId: number,

    artworkId: number,

    request: ArtworkUpdateRequest

) => {

    const response = await axiosInstance.put<ApiResponse<ArtworkResponse>>(

        `/api/exhibitions/${exhibitionId}/artworks/${artworkId}`,

        request

    );

    return response.data;

};

export const deleteArtwork = async (exhibitionId: number, artworkId: number) => {

    const response = await axiosInstance.delete<ApiResponse<null>>(

        `/api/exhibitions/${exhibitionId}/artworks/${artworkId}`

    );

    return response.data;

};

export const searchArtworks = async (keyword: string, page = 0, size = 10) => {

    const response = await axiosInstance.get<

        ApiResponse<PageResponse<ArtworkSimpleResponse>>

    >("/api/artworks/search", {

        params: {

            keyword,

            page,

            size,

        },

    });

    return response.data;

};