import config from "../app/config"
import type { ApiResponse, UploadFileResponse } from "./ResponseInterface"


export const fetchFileUpload = async (
    roomId: number,
    file: File,
    token: string,
): Promise<ApiResponse<UploadFileResponse>> => {

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(config.apiUrl + `/file/upload/${roomId}`, {
            method: 'POST',
            headers: {
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: formData,
        });
        if (!response.ok) throw new Error('File upload failed');
        return await response.json();
    } catch (error) {
        console.error('File upload failed', error);
        throw error;
    }
}