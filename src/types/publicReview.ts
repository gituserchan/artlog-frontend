export type PublicReviewType = "EXHIBITION" | "ARTWORK";

export interface PublicReviewSimpleResponse {
    reviewId: number;
    userId: number;
    nickname: string;
    exhibitionId: number;
    exhibitionTitle: string;
    artworkId: number | null;
    artworkTitle: string | null;
    reviewType: PublicReviewType;
    title: string;
    rating: number;
    emotionTag: string | null;
    keywords: string | null;
    imageUrls: string[];
    likeCount: number;
    bookmarkCount: number;
    createdAt: string;
}

export interface PublicReviewResponse {
    reviewId: number;
    userId: number;
    nickname: string;
    exhibitionId: number;
    exhibitionTitle: string;
    museumName: string;
    artworkId: number | null;
    artworkTitle: string | null;
    artistName: string | null;
    reviewType: PublicReviewType;
    title: string;
    content: string;
    rating: number;
    emotionTag: string | null;
    keywords: string | null;
    wantToRevisit: boolean | null;
    imageUrls: string[];
    likeCount: number;
    bookmarkCount: number;
    createdAt: string;
    updatedAt: string;
}