import { createContext, useContext } from 'react';

export type UrlModeContextValue = {
  modeFromWindow: string | null;
  searchFromWindow: string;
};

export const defaultUrlModeContext: UrlModeContextValue = {
  modeFromWindow: null,
  searchFromWindow: '',
};

export const UrlModeContext = createContext<UrlModeContextValue>(defaultUrlModeContext);

export function useUrlMode(): UrlModeContextValue {
  return useContext(UrlModeContext);
}
