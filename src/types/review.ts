export type ReviewType = "EXHIBITION" | "ARTWORK";

export type ReviewVisibility = "PRIVATE" | "PUBLIC";

export interface ReviewSimpleResponse {
    reviewId: number;
    reviewType: ReviewType;
    exhibitionId: number;
    exhibitionTitle: string;
    artworkId: number | null;
    artworkTitle: string | null;
    title: string;
    rating: number;
    emotionTag: string | null;
    wantToRevisit: boolean | null;
    createdAt: string;
}

export interface ReviewResponse {
    reviewId: number;
    exhibitionId: number;
    exhibitionTitle: string;
    artworkId: number | null;
    artworkTitle: string | null;
    reviewType: ReviewType;
    visibility: ReviewVisibility;
    title: string;
    content: string;
    rating: number;
    emotionTag: string | null;
    keywords: string | null;
    wantToRevisit: boolean | null;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ReviewCreateRequest {
    title: string;
    content: string;
    rating: number;
    emotionTag: string;
    keywords: string;
    wantToRevisit: boolean;
    imageUrls: string[];
    visibility: ReviewVisibility;
}

export interface ReviewUpdateRequest {
    title: string;
    content: string;
    rating: number;
    emotionTag: string;
    keywords: string;
    wantToRevisit: boolean;
    imageUrls: string[];
    visibility: ReviewVisibility;
}