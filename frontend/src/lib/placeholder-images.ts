import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  imageUrl: string;
  imageHint: string;
  description?: string;
};

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

export const getImage = (id: string): ImagePlaceholder => {
    const image = placeholderImages.find((img) => img.id === id);
    if (!image) {
        // Fallback to a default image if not found
        return {
            id: 'not-found',
            imageUrl: 'https://picsum.photos/seed/not-found/600/600',
            imageHint: 'placeholder',
        };
    }
    return image;
};
