export async function callFetch(
    url: string,
    method: "POST" | "PUT" | "DELETE" | "GET",
    token: string | undefined,
    data: any,
) {
    try {
        const res = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(data),
        })

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`)
        }

        return res.json()
    } catch (e: any) {
        return {
            traceId: "99999",
            code: -1,
            errorMessage: e.message,
        }
    }
}