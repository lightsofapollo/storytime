import { create } from "zustand";

interface GlobalState {}

export const useGlobalState = create<GlobalState>((set) => ({}));
