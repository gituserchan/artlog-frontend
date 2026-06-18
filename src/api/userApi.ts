import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";
import type {
    PasswordUpdateRequest,
    UserInfoResponse,
    UserUpdateRequest,
} from "../types/user";

export const getMyInfo = async () => {
    const response = await axiosInstance.get<ApiResponse<UserInfoResponse>>(
        "/api/users/me"
    );

    return response.data;
};

export const updateMyInfo = async (request: UserUpdateRequest) => {
    const response = await axiosInstance.put<ApiResponse<UserInfoResponse>>(
        "/api/users/me",
        request
    );

    return response.data;
};

export const updateMyPassword = async (request: PasswordUpdateRequest) => {
    const response = await axiosInstance.put<ApiResponse<null>>(
        "/api/users/me/password",
        request
    );

    return response.data;
};