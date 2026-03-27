"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import ProductViewDetailSheet from "../components/ProductViewDetailSheet";

type ProductDetailSheetContextType = {
  open: (id: string) => void;
  close: () => void;
};

type ProductDetailSheetProviderProps = {
  children: ReactNode;
};

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
  const [productId, setProductId] = useState<string | null>(null);

  const open = (id: string) => {
    console.log("OPEN", id);
    setProductId(id);
  };
  const close = () => setProductId(null);

  return (
    <ProductDetailSheetContext.Provider value={{ open, close }}>
      {children}

      <ProductViewDetailSheet
        productId={productId}
        isOpen={!!productId}
        onClose={close}
      />
    </ProductDetailSheetContext.Provider>
  );
}
