export interface ExhibitionSimpleResponse {
    exhibitionId: number;
    title: string;
    museumName: string;
    location: string | null;
    visitDate: string | null;
    posterImageUrl: string | null;
    createdAt: string;
}

export interface ExhibitionResponse {
    exhibitionId: number;
    title: string;
    museumName: string;
    location: string | null;
    startDate: string | null;
    endDate: string | null;
    visitDate: string | null;
    posterImageUrl: string | null;
    memo: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ExhibitionCreateRequest {
    title: string;
    museumName: string;
    location: string;
    startDate: string;
    endDate: string;
    visitDate: string;
    posterImageUrl: string | null;
    memo: string;
}

export interface ExhibitionUpdateRequest {
    title: string;
    museumName: string;
    location: string;
    startDate: string;
    endDate: string;
    visitDate: string;
    posterImageUrl: string | null;
    memo: string;
}