import axiosInstance from "./axiosInstance";
import type { ApiResponse } from "../types/api";
import type { LoginRequest, LoginResponse, SignupRequest } from "../types/auth";

export const signup = async (request: SignupRequest) => {
    const response = await axiosInstance.post<ApiResponse<null>>(
        "/api/auth/signup",
        request
    );

    return response.data;
};

export const login = async (request: LoginRequest) => {
    const response = await axiosInstance.post<ApiResponse<LoginResponse>>(
        "/api/auth/login",
        request
    );

    return response.data;
};