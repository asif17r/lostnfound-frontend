import { API_BASE_URL } from './config';

// Function to get a blob URL for an image with authentication
export const fetchImageUrl = async (imageId: string | number | null, token: string): Promise<string | null> => {
    if (!imageId) return null;
    
    // If imageId is already a full URL (for backward compatibility or external images)
    if (typeof imageId === 'string' && imageId.startsWith('http')) return imageId;
    
    try {
        const response = await fetch(`${API_BASE_URL}/images/${imageId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            console.error('Failed to fetch image:', response.status);
            return null;
        }
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
};

// Keep the old function for reference purposes
export const getImageUrl = (imageId: string | number | null) => {
    if (!imageId) return null;
    if (typeof imageId === 'string' && imageId.startsWith('http')) return imageId;
    return `${API_BASE_URL}/images/${imageId}`;
};