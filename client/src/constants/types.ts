// Type Declarations

export type Song = {
    title: string;
    artist: string;
    album: string;
};

export type Playlist = {
    title: string;
    description: string;
    search: string;
    songs: Song[];
    [key: string]: unknown;
};

export type PlaylistSubmit = {
    title: string;
    description: string;
    search: string;
}

interface Artist {
    name: string;
    [key: string]: unknown;
}

interface Album {
    name: string;
    [key: string]: unknown;
}

export interface Track {
    name: string;
    artists: Artist[];
    album: Album;
    [key: string]: unknown;
}

export type PlaylistEdit = {
    _id: string | undefined;
    title: string;
    description: string;
    [key: string]: unknown;
};