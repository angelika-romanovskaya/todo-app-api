import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FilterState } from "./types";
import { FilterType } from "@shared/config/constants";

const initialState: FilterState = { value: "all" };

const filterSlice = createSlice({
	name: "filter",
	initialState,
	reducers: {
		setFilter(state, action: PayloadAction<FilterType>) {
			state.value = action.payload;
		},
	},
});

export const { setFilter } = filterSlice.actions;
export const filterReducer = filterSlice.reducer;
