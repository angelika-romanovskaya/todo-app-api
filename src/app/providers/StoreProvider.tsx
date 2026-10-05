import { store } from "@app/store";
import type { ReactNode } from "react";
import { Provider } from "react-redux";

interface Props {
	children: ReactNode;
}

export function StoreProvider({ children }: Props) {
	return <Provider store={store}>{children}</Provider>;
}
