
export interface AuthState {
	token: string | null;
	user: string | null;
	loading: boolean;
	error: string | null;
}
