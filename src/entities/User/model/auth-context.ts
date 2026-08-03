import { createContext, Dispatch } from "react";
import { AuthAction, AuthState } from "./types";

export const initialAuthState: AuthState = {
	user: null,
	isLoading: true,
	error: null,
};

export const authReducer = (
	state: AuthState,
	action: AuthAction,
): AuthState => {
	switch (action.type) {
		case "LOGIN_START":
			return { ...state, isLoading: true, error: null };
		case "LOGIN_SUCCESS":
			return { isLoading: false, user: action.payload, error: null };
		case "LOGIN_FAILURE":
			return { isLoading: false, user: null, error: action.payload };
		case "LOGOUT":
			return { isLoading: false, user: null, error: null };
		default:
			return state;
	}
};

export const AuthContext = createContext<{
	state: AuthState;
	dispatch: Dispatch<AuthAction>;
}>({
	state: initialAuthState,
	dispatch: () => null,
});
