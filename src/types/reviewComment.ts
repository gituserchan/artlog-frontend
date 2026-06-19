export interface ReviewCommentResponse {
    commentId: number;
    reviewId: number;
    userId: number;
    nickname: string;
    content: string;
    writtenByMe: boolean;
    createdAt: string;
}

export interface ReviewCommentCreateRequest {
    content: string;
}