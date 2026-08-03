import axios from "axios";
import { getToken } from "../lib/tokenStorage";

const httpClient = axios.create({
	baseURL: "https://todo-redev.onrender.com/api",
	headers: {
		"Content-Type": "application/json",
	},
});

httpClient.interceptors.request.use((config) => {
	const token = getToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export default httpClient;
