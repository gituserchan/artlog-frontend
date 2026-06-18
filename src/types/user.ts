export interface UserInfoResponse {
    userId: number;
    email: string;
    nickname: string;
    role: string;
    createdAt: string;
}

export interface UserUpdateRequest {
    nickname: string;
}

export interface PasswordUpdateRequest {
    currentPassword: string;
    newPassword: string;
}