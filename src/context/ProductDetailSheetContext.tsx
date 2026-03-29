"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ProductViewDetailSheet from "../components/ProductViewDetailSheet";
import { Product } from "../types";
import ProductViewDetailWithQuantitySheet from "../components/ProductViewDetailWithQuantitySheet";

type ProductDetailSheetContextType = {
  openById: (id: string) => void;
  openByData: (product: Product) => void;
  close: () => void;
};

type ProductDetailSheetProviderProps = {
  children: ReactNode;
};

type ProductDetailState =
  | { type: "id"; id: string }
  | { type: "data"; product: Product }
  | null;

const ProductDetailSheetContext =
  createContext<ProductDetailSheetContextType | null>(null);

export const useProductDetailSheet = () => {
  const context = useContext(ProductDetailSheetContext);

  if (!context) {
    throw new Error("lỗi product detail sheet context");
  }

  return context;
};

export function ProductDetailSheetProvider({
  children,
}: ProductDetailSheetProviderProps) {
  const [state, setState] = useState<ProductDetailState>(null);

  const openById = (id: string) => {
    setState({ type: "id", id });
  };

  const openByData = (product: Product) => {
    setState({ type: "data", product });
  };

  const close = () => setState(null);

  return (
    <ProductDetailSheetContext.Provider value={{ openById, openByData, close }}>
      {children}

      {state?.type === "id" && (
        <ProductViewDetailSheet productId={state.id} isOpen onClose={close} />
      )}

      {state?.type === "data" && (
        <ProductViewDetailWithQuantitySheet
          product={state.product}
          isOpen
          onClose={close}
        />
      )}
    </ProductDetailSheetContext.Provider>
  );
}
