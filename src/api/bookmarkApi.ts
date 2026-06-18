import axiosInstance from "./axiosInstance";
import type { ApiResponse, PageResponse } from "../types/api";
import type { ReviewBookmarkResponse } from "../types/bookmark";

export const getMyBookmarks = async (page = 0, size = 10) => {
    const response = await axiosInstance.get<
        ApiResponse<PageResponse<ReviewBookmarkResponse>>
    >("/api/users/me/bookmarks", {
        params: {
            page,
            size,
        },
    });

    return response.data;
};