"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Shelf } from "../types";
import ShelfViewDetailSheet from "../components/ShelfViewDetailSheet";
import ShelfViewDetailSheetWithQuantity from "../components/ShelfViewDetailSheetWithQuantity";

type ShelfDetailSheetContextType = {
  openById: (id: string) => void;
  openByData: (shelf: Shelf) => void;
  close: () => void;
};

type ShelfDetailSheetProviderProps = {
  children: ReactNode;
};

type ShelfDetailState =
  | { type: "id"; id: string }
  | { type: "data"; shelf: Shelf }
  | null;

const ShelfDetailSheetContext =
  createContext<ShelfDetailSheetContextType | null>(null);

export const useShelfDetailSheet = () => {
  const context = useContext(ShelfDetailSheetContext);

  if (!context) {
    throw new Error("lỗi product detail sheet context");
  }

  return context;
};

export function ShelfDetailSheetProvider({
  children,
}: ShelfDetailSheetProviderProps) {
  const [state, setState] = useState<ShelfDetailState>(null);

  const openById = (id: string) => {
    setState({ type: "id", id });
  };

  const openByData = (shelf: Shelf) => {
    setState({ type: "data", shelf });
  };

  const close = () => setState(null);

  return (
    <ShelfDetailSheetContext.Provider value={{ openById, openByData, close }}>
      {children}

      {state?.type === "id" && (
        <ShelfViewDetailSheet shelfId={state.id} isOpen onClose={close} />
      )}

      {state?.type === "data" && (
        <ShelfViewDetailSheetWithQuantity
          shelf={state.shelf}
          isOpen
          onClose={close}
        />
      )}
    </ShelfDetailSheetContext.Provider>
  );
}
