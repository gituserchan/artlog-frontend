export interface ArtworkSimpleResponse {
    artworkId: number;
    exhibitionId: number;
    title: string;
    artistName: string | null;
    productionYear: string | null;
    medium: string | null;
    imageUrl: string | null;
    memo: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ArtworkResponse {
    artworkId: number;
    exhibitionId: number;
    title: string;
    artistName: string | null;
    productionYear: string | null;
    medium: string | null;
    imageUrl: string | null;
    memo: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ArtworkCreateRequest {
    title: string;
    artistName: string;
    productionYear: string;
    medium: string;
    imageUrl: string | null;
    memo: string;
}

export interface ArtworkUpdateRequest {
    title: string;
    artistName: string;
    productionYear: string;
    medium: string;
    imageUrl: string | null;
    memo: string;
}