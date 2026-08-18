import { HomePage } from "@pages/home/HomePage";
import { App as AntApp } from "antd";
import "./styles/global.css";
import {
	AntdProvider,
	ThemeProvider,
	AuthProvider,
	QueryProvider,
} from "./providers";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@pages/login";
import { RegisterPage } from "@pages/register";
import { ProtectedRoute } from "@shared/hooks/useProtectedRoute";

function App() {
	const basename = import.meta.env.BASE_URL || "/";
	return (
		<AntApp>
			<ThemeProvider>
				<AntdProvider>
					<QueryProvider>
						<AuthProvider>
							<BrowserRouter basename={basename}>
								<Routes>
									<Route path="/login" element={<LoginPage />} />
									<Route path="/register" element={<RegisterPage />} />
									<Route
										path="/"
										element={
											<ProtectedRoute>
												<HomePage />
											</ProtectedRoute>
										}
									/>
									<Route path="*" element={<Navigate to="/" />} />
								</Routes>
							</BrowserRouter>
						</AuthProvider>
					</QueryProvider>
				</AntdProvider>
			</ThemeProvider>
		</AntApp>
	);
}

export default App;
