/**
 * Uploads an image file to Cloudinary via the server-side API route.
 * Falls back to a placeholder if the API is unavailable.
 */
export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to upload image');
    }

    const data = await res.json();
    return data.url as string;
}
