import { useContext } from "react";
import { AuthContext } from "@entities/User/model/auth-context";
import { removeToken } from "@shared/lib/tokenStorage";

export const useAuth = () => {
	const { state, dispatch } = useContext(AuthContext);

	const login = (user: { email: string; password: string }) => {
		dispatch({ type: "LOGIN_SUCCESS", payload: user });
	};

	const logout = () => {
		removeToken();
		dispatch({ type: "LOGOUT" });
	};

	return {
		...state,
		login,
		logout,
		isAuthenticated: !!state.user,
		isLoading: state.isLoading,
		user: state.user,
		error: state.error,
	};
};
