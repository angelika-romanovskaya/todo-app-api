import React, { useContext, createContext } from "react";
import {
	getToken,
	getUserEmail,
	removeToken,
	setToken,
	setUserEmail,
} from "@shared/lib/tokenStorage";
import { LocalStorageService } from "@shared/lib/localStorage";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@shared/api/queryKeys";
import httpClient from "@shared/api/httpClient";
import { IUser } from "@entities/User/model/types";
import { authApi } from "@shared/api/authApi";

interface AuthContextType {
	user: IUser | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const queryClient = useQueryClient();

	const { data: user, isLoading } = useQuery<IUser | null, Error>({
		queryKey: queryKeys.me,
		queryFn: async () => {
			const token = getToken();
			if (!token) return null;

			try {
				await httpClient.get("/todos");
				const email = getUserEmail() || "user";
				return { email } as IUser;
			} catch (error) {
				removeToken();
				LocalStorageService.remove("userEmail");
				return null;
			}
		},
		retry: false,
		staleTime: Infinity,
	});

	const login = async (email: string, password: string) => {
		const token = await authApi.login(email, password);
		setToken(token);
		setUserEmail(email);
		queryClient.setQueryData(queryKeys.me, { email });
		queryClient.invalidateQueries({ queryKey: queryKeys.todos });
	};

	const register = async (email: string, password: string, name: string) => {
		const token = await authApi.register(email, password, name);
		setToken(token);
		setUserEmail(email);
		queryClient.setQueryData(queryKeys.me, { email, name });
		queryClient.invalidateQueries({ queryKey: queryKeys.todos });
	};

	const logout = () => {
		removeToken();
		localStorage.removeItem("userEmail");
		queryClient.setQueryData(queryKeys.me, null);
		queryClient.removeQueries({ queryKey: queryKeys.todos });
	};

	const value: AuthContextType = {
		user: user || null,
		isLoading,
		isAuthenticated: !!user,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
