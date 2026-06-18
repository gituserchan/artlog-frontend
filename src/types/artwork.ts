export interface ArtworkSimpleResponse {
    artworkId: number;
    title: string;
    artist: string | null;
    productionYear: number | null;
    imageUrl: string | null;
    createdAt: string;
}

export interface ArtworkResponse {
    artworkId: number;
    title: string;
    artist: string | null;
    productionYear: number | null;
    medium: string | null;
    size: string | null;
    imageUrl: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ArtworkCreateRequest {
    title: string;
    artist: string;
    productionYear: number | null;
    medium: string;
    size: string;
    imageUrl: string | null;
    description: string;
}

export interface ArtworkUpdateRequest {
    title: string;
    artist: string;
    productionYear: number | null;
    medium: string;
    size: string;
    imageUrl: string | null;
    description: string;
}