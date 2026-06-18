import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";

interface ImageUploadResponse {
    imageUrl: string;
}

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<
        ApiResponse<ImageUploadResponse | string>
    >("/api/files/images", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    if (typeof response.data.data === "string") {
        return response.data.data;
    }

    return response.data.data.imageUrl;
};