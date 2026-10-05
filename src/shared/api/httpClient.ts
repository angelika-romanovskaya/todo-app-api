const BASE_URL = import.meta.env.VITE_API_URL ?? "";

interface RequestOptions {
	method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
	body?: unknown;
	token?: string | null;
}

export async function apiRequest<T>(
	path: string,
	{ method = "GET", body, token }: RequestOptions = {},
): Promise<T> {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (token) headers.Authorization = `Bearer ${token}`;

	const response = await fetch(`${BASE_URL}${path}`, {
		method,
		headers,
		body: body ? JSON.stringify(body) : undefined,
	});

	if (!response.ok) {
		const data = await response.json().catch(() => null);
		const message =
			data?.message ?? `HTTP ${response.status}: ${response.statusText}`;
		throw new Error(message);
	}

	if (response.status === 204) return undefined as T;

	return response.json() as Promise<T>;
}
