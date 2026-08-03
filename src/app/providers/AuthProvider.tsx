import React, { useReducer, useEffect } from "react";
import {
	AuthContext,
	authReducer,
	initialAuthState,
} from "@entities/User/model/auth-context";
import { getToken, removeToken } from "@shared/lib/tokenStorage";
import { LocalStorageService } from "@shared/lib/localStorage";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(authReducer, initialAuthState);

	useEffect(() => {
		const token = getToken();

		if (!token) {
			dispatch({ type: "LOGOUT" });
			return;
		}

		dispatch({ type: "LOGIN_START" });

		fetch("https://todo-redev.onrender.com/api/todos", {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((res) => {
				if (res.ok) {
					const user = LocalStorageService.get("user", "") || "user";

					dispatch({
						type: "LOGIN_SUCCESS",
						payload: JSON.parse(user),
					});
				} else {
					removeToken();
					dispatch({ type: "LOGOUT" });
				}
			})
			.catch(() => {
				removeToken();
				dispatch({ type: "LOGOUT" });
			});
	}, []);

	return (
		<AuthContext.Provider value={{ state, dispatch }}>
			{children}
		</AuthContext.Provider>
	);
};
