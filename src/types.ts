export interface Post {
    id: number;
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    category: string;
    status: string;
    range: number;
    userId: number;
    userName: string;
    imageId: number | null;
}