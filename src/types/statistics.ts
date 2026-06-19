export interface StatisticsSummaryResponse {
    exhibitionCount: number;
    artworkCount: number;
    reviewCount: number;
    averageRating: number | null;
}

export interface MonthlyVisitResponse {
    month: string;
    count: number;
}

export interface TopMuseumResponse {
    museumName: string;
    count: number;
}

export interface RatingDistributionResponse {
    rating: number;
    count: number;
}

export interface TopEmotionTagResponse {
    emotionTag: string;
    count: number;
}