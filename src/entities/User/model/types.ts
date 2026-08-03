export interface IUser {
	email: string;
	password: string;
	name?: string;
}

export interface AuthState {
	user: IUser | null;
	isLoading: boolean;
	error: string | null;
}

export type AuthAction =
	| { type: "LOGIN_START" }
	| { type: "LOGIN_SUCCESS"; payload: IUser }
	| { type: "LOGIN_FAILURE"; payload: string }
	| { type: "LOGOUT" };
