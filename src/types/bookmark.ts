export type BookmarkReviewType = "EXHIBITION" | "ARTWORK";

export interface ReviewBookmarkResponse {
    bookmarkId: number;
    reviewId: number;
    userId: number;
    nickname: string;
    exhibitionId: number;
    exhibitionTitle: string;
    artworkId: number | null;
    artworkTitle: string | null;
    reviewType: BookmarkReviewType;
    title: string;
    rating: number;
    emotionTag: string | null;
    keywords: string | null;
    imageUrls: string[];
    bookmarkedAt: string;
}