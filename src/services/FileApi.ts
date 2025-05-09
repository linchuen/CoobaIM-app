import config from "../app/config"
import { FakeSuccessResponse } from "./FakeSuccessResponse";
import type { ApiResponse, UploadFileResponse } from "./ResponseInterface"


export const fetchFileUpload = async (
    roomId: number,
    file: File,
    token: string,
): Promise<ApiResponse<UploadFileResponse>> => {
    if (config.useFake) {
        return new FakeSuccessResponse({
            fileName: "img_girl",
            url: "https://www.w3schools.com/html/img_girl.jpg"
        })
    }
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

export const fetchImageUpload = async (
    roomId: number,
    file: File,
    token: string,
): Promise<ApiResponse<UploadFileResponse>> => {
    if (config.useFake) {
        return new FakeSuccessResponse({
            fileName: "img_girl",
            url: "https://www.w3schools.com/html/img_girl.jpg"
        })
    }
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

export const fetchAvatarUpload = async (
    file: File,
    token: string,
): Promise<ApiResponse<UploadFileResponse>> => {
    if (config.useFake) {
        return new FakeSuccessResponse({
            fileName: "img_girl",
            url: "https://www.w3schools.com/html/img_girl.jpg"
        })
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(config.apiUrl + `/file/upload/avatar`, {
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

export const fetchGetImage = async (
    roomId: number,
    fileName: string,
    token: string,
): Promise<string> => {
    try {
        const res = await fetch(`/api/file/images/${roomId}/${fileName}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        return objectUrl;
    } catch (error) {
        console.error("Fallback image fetch failed:", error);
        throw error;
    }
}